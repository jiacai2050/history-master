(ns history-master.io
  (:require [goog.dom :as gdom]
            [antizer.reagent :as ant]
            [re-frame.core :as rf]
            [clojure.string :as str]
            [history-master.common :refer [default-range] :as c]
            ))

(defn import-histories []
  (let [file-choose (gdom/getElement "file_chooser")]
    (set! (.-value file-choose) "")
    (set! (.-onchange file-choose) (fn []
                                     (let [file (aget file-choose "files" 0)
                                           reader (js/FileReader.)]
                                       (set! (.-onloadend reader)
                                             (fn [resp]
                                               (let [csv-body resp.target.result
                                                     [headings & histories] (str/split csv-body "\n")]
                                                 (doseq [line histories]
                                                   (let [[visit-time title _ _ _ url] (str/split line ",")]
                                                     (rf/dispatch [:add-history {:url url :visitTime (js/parseInt visit-time)
                                                                                 :title title}])))
                                                 (ant/message-info (str (count histories) " histories imported. Try research!")))))
                                       (.readAsText reader file))))
    (.click file-choose)))

(defn export-histories []
  (let [content (js/Blob. [(c/to-csv @(rf/subscribe [:histories]))])
        filename (str (str/join "_" (map c/date->human @(rf/subscribe [:date-range]))) ".csv")]
    (.download js/chrome.downloads (clj->js {:url (.createObjectURL js/window.URL content)
                                             :saveAs true
                                             :filename filename}))))
