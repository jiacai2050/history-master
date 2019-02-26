(ns history-master.chrome
  (:require [re-frame.core :as rf]
            [reagent.core :as r]
            [history-master.common :refer [search-limit default-range] :as c]))

(def standard-interceptors [(when ^boolean goog.DEBUG rf/debug)])

(rf/reg-fx
 :chrome-query
 (fn [[start end text]]
   (println "search with" (mapv #(c/datetime->human %) [start end]) text)
   (js/chrome.history.search (clj->js {:text (or text "")
                                       :startTime start
                                       :endTime end
                                       :maxResults search-limit})
                             (fn [items]
                               (rf/dispatch [:query-result items])))))

(rf/reg-event-fx
 :boot
 (fn [{:keys [db]} _]
   (let [range-in-ms (map #(-> % (.valueOf) c/trim-date->today)
                          default-range)
         series-ranges (apply c/gen-date-ranges range-in-ms)]
     {:db (assoc db
                 :loading? true
                 :date-range range-in-ms
                 :series-ranges series-ranges
                 :selected-day (first series-ranges))
      :chrome-query range-in-ms})))

(rf/reg-event-fx
 :query-history
 (fn [{:keys [db]} [_ text]]
   (let [[start-ts end-ts] (:date-range db)
         series-ranges (c/gen-date-ranges start-ts end-ts)]
     {:db (assoc db
                 :loading? true
                 :series-ranges series-ranges
                 :selected-day (first series-ranges))
      :chrome-query [start-ts end-ts text]})))

(rf/reg-event-db
 :query-result
 (fn [db [_ items]]
   (assoc db
          :histories (js->clj items :keywordize-keys true)
          :loading? false)))

(rf/reg-event-fx
 :add-history
 (fn [{:keys [db]} [_ history]]
   {:chrome-add history}))

(rf/reg-fx
 :chrome-add
 (fn [history]
   (js/chrome.history.addUrl (clj->js (if (c/is-google-chrome?)
                                        ;; history.addUrl only support url in Google Chrome, sad.
                                        {:url (:url history)}
                                        history))
                             (fn []
                               (rf/dispatch [:add-result history])))))

(rf/reg-event-db
 :add-result
 (fn [db [_ history]]
   (update db :histories #(conj % history))))

(rf/reg-sub
 :date-range
 (fn [db _]
   (:date-range db)))

(rf/reg-event-db
 :set-date-range
 (fn [db [_ date-range]]
   (assoc db :date-range (map #(-> % (.valueOf) c/trim-date->today)
                              date-range))))

(rf/reg-sub
 :series-ranges
 (fn [db _]
   (:series-ranges db)))

(rf/reg-event-db
 :update-selected-day
 (fn [db [_ selected-day]]
   (assoc db :selected-day selected-day)))

(rf/reg-sub
 :selected-day
 (fn [{:keys [selected-day available-ranges] :as db} _]
   (js/parseInt (or selected-day (first available-ranges)))))

(rf/reg-sub
 :loading?
 (fn [db _]
   (:loading? db)))

(rf/reg-sub
 :histories
 (fn [{:keys [histories]} _]
   (map (fn [item]
          {:visit-time (:lastVisitTime item)
           :title (some #(when-not (empty? %) %) ((juxt :title :url) item))
           :visit-count (:visitCount item)
           :typed-count (:typedCount item)
           :id (:id item)
           :url (:url item)})
        histories)))

(rf/reg-sub
 :visit-details-by-day
 :<- [:histories]
 :<- [:selected-day]
 (fn [[histories current-day] _]
   (let [lower (c/trim-date->today current-day)
         upper (c/trim-date->tomorrow current-day)]
     (->> histories
          (filter (fn [{:keys [visit-time]}]
                    (and 
                     (<= lower visit-time)
                     (< visit-time upper))))
          (sort-by #(- (:visit-time %)))))))

(rf/reg-sub
 :pv-trend
 :<- [:histories]
 (fn [histories _]
   (->> histories
        (map (fn [{:keys [visit-time]}]
               {:visit-day (c/trim-date->today visit-time)}))
        (group-by :visit-day)
        (map (fn [[visit-day items]]
               {:visit-day visit-day
                :pv (count items)}))
        (sort-by :visit-day))))

(rf/reg-sub
 :pv-map
 :<- [:pv-trend]
 (fn [pv-trend _]
   (reduce
    (fn [m {:keys [visit-day pv]}]
      (assoc m visit-day pv))
    {}
    pv-trend)))

(rf/reg-sub
 :total 
 :<- [:histories]
 (fn [histories _]
   (count histories)))

(rf/reg-sub
 :scheme-percentage
 :<- [:histories]
 (fn [histories _]
   (->> histories
        (map (fn [{:keys [url]}]
               {:scheme (second (re-find #"(.+?)://" url))}))
        (group-by :scheme)
        (map (fn [[scheme items]]
               {:name scheme
                :value (count items)}))
        (sort-by #(- (:value %))))))

(rf/reg-sub
 :topn-percentage
 :<- [:histories]
 (fn [histories [_ group-key top-n]]
   (->> (case group-key
          :title (map (fn [{:keys [title]}]
                        {:title (subs title 0 50)})
                      histories)
          :domain (map (fn [{:keys [url]}]
                         {:domain (or (second (re-find #"://(.+?)/" url))
                                      url)})
                       histories))
        (group-by group-key)
        (map (fn [[k items]]
               {:name k
                :value (count items)}))
        (sort-by #(- (:value %)))
        (take top-n))))

;; remove history
(rf/reg-fx
 :chrome-delete
 (fn [{:keys [via params] :as opts}]

   (case via
     :range (let [[start end] params]
              (js/chrome.history.deleteRange (clj->js {:startTime start
                                                       :endTime end})
                                             #(rf/dispatch [:delete-done opts])))
     :all-like-this (js/chrome.history.deleteUrl (clj->js {:url params})
                                                 #(rf/dispatch [:delete-done opts])))))

(rf/reg-event-fx
 :delete-history
 (fn [_ [_ {:keys [via params] :as opts}]]
   {:chrome-delete (case via
                     :single (let [visit-time params
                                   delta 0.1]
                               ;; Chrome extension doesn't support deleteById, so we deleteByRange
                               {:via :range :params [(- visit-time delta) (+ visit-time delta)]})
                     (:range :all-like-this) opts)}))

(rf/reg-event-db
 :delete-done
 (fn [db [_ {:keys [via params]} start end]]
   (update db :histories #(case via
                            :range (let [[start end] params]
                                     (remove (fn [item] (<= start (:lastVisitTime item) end))
                                             %))
                            :all-like-this (remove (fn [{:keys [url]}] (= url params))
                                                   %)))))


(rf/reg-fx
 :url-visits
 (fn [url]
   (js/chrome.history.getVisits (clj->js {:url url})
                                #(rf/dispatch [:get-visits-done %]))))

(rf/reg-event-fx
 :get-visits
 (fn [_ [_ url]]
   {:url-visits url}))

(rf/reg-event-db
 :get-visits-done
 (fn [db [_ url-visits]]
   (assoc db :url-visits (js->clj url-visits :keywordize-keys true))))

(rf/reg-sub
 :url-visits
 (fn [db _]
   (:url-visits db)))

(rf/reg-sub
 :visit-types
 :<- [:url-visits]
 (fn [url-visits _]
   (->> url-visits
        (group-by :transition)
        (map (fn [[k v]]
               {:name k :value (count v)})))))

(rf/reg-sub
 :visit-trend
 :<- [:url-visits]
 (fn [url-visits _]
   (->> url-visits
        (map (fn [{:keys [visitTime]}]
               {:visit-day (c/trim-date->today visitTime)}))
        (group-by :visit-day)
        (map (fn [[visit-day items]]
               {:visit-day visit-day
                :pv (count items)}))
        (sort-by :visit-day))))
