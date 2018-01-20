(ns history-master.activity
  (:require [re-frame.core :as rf]
            [reagent.core :as r]
            [antizer.reagent :as ant]
            [goog.string :as gstr]
            [goog.string.format]
            [history-master.common :refer [default-range] :as c]
            [history-master.stat :refer [pie-chart pv-trend]]))

(defn timeline-sidebar []
  (let [pv-map @(rf/subscribe [:pv-map])
        selected-day (str @(rf/subscribe [:selected-day]))]
    [ant/layout-sider
     [ant/affix
      [ant/menu {:selected-keys [selected-day] :theme "dark"
                 :on-click #(rf/dispatch [:update-selected-day (.-key %)])}
       (for [current-day @(rf/subscribe [:series-ranges])]
         ^{:key current-day} [ant/menu-item
                              [ant/tooltip {:title (pv-map current-day "0") :placement "rightBottom"}
                               (c/date->human current-day)]])]]]))

(defn comparsion [a b index-key]
  (apply compare (map index-key (js->clj [a b] :keywordize-keys true))))

(defn table-view [display-visit? display-title]
  (let [selected-day (rf/subscribe [:selected-day])
        histories (rf/subscribe [:visit-details-by-day])]
    [ant/table {:dataSource @histories :bordered true :row-key "id" :size "small" :style {:width "80%"}
                :title (constantly (r/as-element [:center (c/date->human @selected-day)]))
                :scroll {:y 900}
                :columns [{:title "Visit Time" :dataIndex "visit-time" :width 100
                           :render #(c/time->human %)
                           :sorter #(comparsion %1 %2 :visit-time) :defaultSortOrder "descend"
                           ;; FIXME why on-filter can't work
                           :onFilter (fn [value record]
                                       (= value (c/extract-hour-from-date (:visit-time (js->clj record :keywordize-keys true)))))
                           :filters (->> @histories
                                         (map #(-> % :visit-time c/extract-hour-from-date))
                                         set
                                         (map #(do {:text % :value %}))
                                         (sort-by #(- (js/parseInt (:value %))))
                                         clj->js)}
                          {:title "Title" :dataIndex "title" :width 500
                           :render (fn [text record idx]
                                     (let [url (.-url record)]
                                       (r/as-element [ant/popover {:content (r/as-element [:a {:target "_blank" :href url} url])}
                                                      [:img {:src (str "chrome://favicon/" url)}]
                                                      " "
                                                      [:a {:href url :target "_blank"} (subs text 0 300)]])))}
                          {:title "Visit Count" :dataIndex "visit-count" :width 100 :sorter #(comparsion %1 %2 :visit-count)
                           :render (fn [text record _]
                                     (r/as-element [:a {:type "dashed" :on-click #(do (rf/dispatch [:get-visits (.-url record)])
                                                                                      (reset! display-title {:title (subs (.-title record) 0 300)
                                                                                                             :url (.-url record)
                                                                                                             :count text})
                                                                                      (reset! display-visit? true))} text]))}
                          {:title "Action" :key "action" :width 80
                           :render (fn [text record]
                                     (r/as-element [ant/popconfirm {:title "Are you sure?"
                                                                    :on-confirm #(rf/dispatch [:delete-history {:via :single
                                                                                                                :item (js->clj record :keywordize-keys true)}])}
                                                    [ant/button {:icon "delete" :type "danger"}]]))}]
                :pagination {:show-size-changer true
                             :default-page-size 50
                             :page-size-options ["50" "100" "200" "500"]
                             :show-total #(str "Total: " % " ")}}]))

(defn visit-chart []
  [ant/card
   [ant/card {:title "Visit Trend" :type "inner"}
    [pv-trend @(rf/subscribe [:visit-trend]) "90%" 300]]
   [ant/card {:type "inner" :title (r/as-element [ant/tooltip {:title "How the browser navigated to the URL" :placement "right"}
                                    [:a {:href c/transition-doc :target "_blank"} "Transition Type"]])}
    [pie-chart @(rf/subscribe [:visit-types]) "90%" 300]]])

(defn visit-details []
  (r/with-let [display-visit? (r/atom false)
               display-title (r/atom nil)]
    [:div
     [ant/modal {:visible @display-visit? :footer false :width (* 0.9 (.-innerWidth js/window))
                 :title (r/as-element [:center [:a {:href (:url @display-title) :target "_blank"} (str (:title @display-title))]
                                       (gstr/format " (Total visits: %s)" (:count @display-title))])
                 :on-cancel #(reset! display-visit? false)}
      [visit-chart]]
     [table-view display-visit? display-title]]))

(defn activity-tab []
  [ant/layout
   [timeline-sidebar]
   [ant/layout-content
    [visit-details]]])
