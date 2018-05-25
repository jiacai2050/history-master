(ns history-master.local-db
  (:require [reagent.core :as r]
            [alandipert.storage-atom :refer [local-storage] :as st]))

(defn current-version []
  (if-let [manifest (.getManifest js/chrome.runtime)]
    (.-version manifest)
    "0.1"))

(def page-size (local-storage (r/atom 50)
                              :page-size))
