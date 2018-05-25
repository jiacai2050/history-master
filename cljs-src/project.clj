(defproject history-master "2.0.0"
  :description "Visualize browsing history, Discover your unknown habits, downloads supported."
  :url "https://github.com/jiacai2050/history-master"
  :min-lein-version "2.7.1"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [cljsjs/antd "3.1.0-0"]
                 [cljsjs/react "16.2.0-3"]
                 [antizer "0.2.2" :exclusions [cljsjs/antd]]
                 [reagent "0.8.0-alpha2" :exclusions [cljsjs/react]]
                 [re-frame "0.10.3-beta1"]
                 [org.clojure/clojurescript "1.9.946"]
                 [alandipert/storage-atom "2.0.1"]
                 [cljsjs/moment "2.17.1-1"]]
  :target-path "target/%s/"
  :profiles {:dev {:dependencies [[figwheel-sidecar "0.5.14"]
                                  [com.cemerick/piggieback "0.2.2"]]
                   :plugins [[lein-figwheel "0.5.14"]
                             [lein-cljsbuild "1.1.7"]
                             [lein-doo "0.1.8"]]
                   :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}
                   :source-paths ["src/option"]
                   :clean-targets ^{:protect false} [:target-path "resources/dev/option/js"]
                   :cljsbuild {:builds [{:id "dev"
                                         :figwheel true
                                         :source-paths ["src/option"]
                                         :compiler {:output-to "resources/dev/option/js/main.js"
                                                    :output-dir "resources/dev/option/js/out"
                                                    :source-map true
                                                    :optimizations :none
                                                    :main history_master.option}}]}
                   :figwheel {:server-port 8001
                              :http-server-root "dev/option"
                              :css-dirs ["resources/dev/option/css"]
                              :server-logfile ".figwheel_option.log"
                              :repl true}}
             :release {:clean-targets ^{:protect false} ["resources/release/option/js"]
                       :cljsbuild {:builds [{:id "option"
                                             :source-paths ["src/option"]
                                             :compiler {:output-to "resources/release/option/js/main.js"
                                                        :output-dir "resources/release/option/js/out"
                                                        :externs ["externs/chrome_extensions.js" "externs/chrome.js" "externs/echarts.ext.js"]
                                                        :optimizations :advanced
                                                        :main history_master.option}}]}}}
  :aliases {"option" ["with-profile" "dev" "do"
                      ["clean"]
                      ["figwheel" "dev"]]})
