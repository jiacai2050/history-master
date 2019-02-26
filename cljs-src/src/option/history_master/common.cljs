(ns history-master.common
  (:require [clojure.string :as str]))

(def homepage "https://github.com/jiacai2050/history-master")
(def transition-doc (str homepage "/wiki/Transition-Type"))
(def default-range [(-> (js/moment) (.subtract 6 "days")) (-> (js/moment) (.add 1 "days"))])
(def search-limit (dec (.pow js/Math 2 31)))
(def date-format "YYYY-MM-DD")
(def time-format "HH:mm:ss")
(def datetime-format (str date-format " " time-format))

(def one-day-in-ms (* 1000 60 60 24))

(defn date->human [timestamp]
  (-> timestamp
      js/moment
      (.format date-format)))

(defn time->human [timestamp]
  (-> timestamp
      js/moment
      (.format time-format)))

(defn datetime->human [timestamp]
  (-> timestamp
      js/moment
      (.format datetime-format)))

(defn date->computer [timestamp]
  (-> timestamp
      js/moment
      (.format date-format)))

(defn trim-date->today [timestamp]
  (.. (js/moment timestamp)
      (startOf "day")
      (valueOf)))

(defn trim-date->tomorrow [timestamp]
  (.. (js/moment timestamp)
      (add 1 "days")
      (startOf "day")
      (valueOf)))

(defn extract-hour-from-date [timestamp]
  (.. (js/moment timestamp)
      (format "HH")))

(defn gen-date-ranges [start end]
  (rest (range end (dec start) (- one-day-in-ms))))

(defn to-csv [histories]
  (let [[[first] more] (split-at 1 histories)
        columns (keys first)]
    (->> more
         (map (fn [item]
                (->> (map (fn [column]
                            (clojure.string/replace (str (column item)) "," " "))
                          columns)
                     (str/join ","))))
         (into [(str/join "," (map name columns))])
         (str/join "\n"))))

(defn is-google-chrome? []
  (str/index-of js/navigator.userAgent
                "Chrome"))
