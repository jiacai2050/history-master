## Develop

This addon is written in ClojureScript, so [lein](https://leiningen.org/) is required.

In development period, `optimizations` is set to `none`, and mainly consists of one command:

- `lein option`, setup a figwheel server for option page

In release period, `optimizations` is set to `advanced`, and just run `./release.sh` to get the finally optimized version in your home dir.
