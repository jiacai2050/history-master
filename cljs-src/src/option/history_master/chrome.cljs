(ns history-master.chrome
  (:require [re-frame.core :as rf]
            [reagent.core :as r]
            [history-master.common :refer [search-limit default-range] :as c]))

(rf/reg-fx
 :chrome-query
 (fn [[start end text]]
   (println "search with" (mapv #(c/datetime->human %) [start end]) text)
   (js/chrome.history.search (clj->js {:text (or text "")
                                       :startTime start
                                       :endTime end
                                       :maxResults search-limit})
                             (fn [items]
                               ;; (.log js/console items)
                               (rf/dispatch [:query-result items])))))

(rf/reg-event-fx
 :boot
 (fn [{:keys [db]} _]
   (let [range-in-ms (map #(-> % (.valueOf) c/trim-date->today)
                          default-range)]
     {:db (assoc db
                 :loading? true
                 :date-range range-in-ms)
      :chrome-query range-in-ms})))

(rf/reg-event-fx
 :query-history
 (fn [{:keys [db]} [_ start end text]]
   (let [[start-ts end-ts] (map #(-> % (.valueOf) c/trim-date->today)
                                [start end])]
     {:db (assoc db
                 :loading? true
                 :date-range [start-ts end-ts])
      :chrome-query [start-ts end-ts text]})))


(rf/reg-event-db
 :query-result
 (fn [db [_ items]]
   (assoc db
          :histories (js->clj items :keywordize-keys true)
          :loading? false)))

(rf/reg-sub
 :date-range
 (fn [db _]
   (:date-range db)))

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
 (fn [histories [_ current-day]]
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
 (fn [[start end]]
   (js/chrome.history.deleteRange (clj->js
                                   {:startTime start 
                                    :endTime end})
                                  #(rf/dispatch [:delete-done start end]))))

(rf/reg-event-fx
 :delete-history
 (fn [_ [_ {:keys [via] :as opts}]]
   {:chrome-delete (case via
                     :range (let [{:keys [start end]} opts]
                              [start end])
                     :single (let [{:keys [item]} opts
                                   {:keys [visit-time]} item
                                   delta 0.1]
                               ;; Chrome extension doesn't support deleteById, so we deleteByRange
                               [(- visit-time delta) (+ visit-time delta)]))}))

(rf/reg-event-db
 :delete-done
 (fn [db [_ start end]]
   (update db :histories #(remove (fn [item] (<= start (:lastVisitTime item) end))
                                  %))))
