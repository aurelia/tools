# aurelia-tools

[![npm Version](https://img.shields.io/npm/v/aurelia-tools.svg)](https://www.npmjs.com/package/aurelia-tools)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains some base tools used in the development of Aurelia itself as well as the source for browser debugging tools.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/hub.html). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## To create a dev environment:

1. Create an aurelia directory to hold all of the projects.

  ```shell
  mkdir aurelia
  ```
2. Change to the new directory

  ```shell
  cd aurelia
  ```
3. Clone this repository into the `tools` directory.  This repo contains the helper tools for creating the dev environment.

  ```shell
  git clone https://github.com/aurelia/tools.git
  ```
4. Clone the skeleton-navigation also which is the base app for testing -

  ```shell
  git clone https://github.com/aurelia/skeleton-navigation.git
  ```
5. Change directory into skeleton-navigation

  ```shell
  cd skeleton-navigation
 ```
6. Install the skeleton-navigation application's dependencies:

  ```shell
  npm install
  jspm install
  ```
7. Build the dev environment.  This will create all of the directories inside of `aurelia` under the proper name, `git clone` them all and then perform a `gulp build`.

  ```shell
  gulp build-dev-env
  ```

Now you have the ability to update the repos locally, make changes, and use those in the skeleton app in the `aurelia` directory by using the `gulp update-own-deps` command.

Alternatively, run `gulp pull-dev-env` to only pull down each `aurelia` dependency and not perform builds.

## Aurelia Context Chrome extension

The chrome extension has moved to the [aurelia/inspector](https://github.com/aurelia/inspector) repo.
