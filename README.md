# aurelia-tools

[![npm Version](https://img.shields.io/npm/v/aurelia-tools.svg)](https://www.npmjs.com/package/aurelia-tools)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains some base tools used in the development of Aurelia itself as well as the source for browser debugging tools.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/) and [our email list](http://durandal.us10.list-manage1.com/subscribe?u=dae7661a3872ee02b519f6f29&id=3de6801ccc). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards. You can get an overview of all Aurelia work by visiting [the framework board](https://github.com/aurelia/framework#boards).

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

## Aurelia Context Chrome extension instructions

The Aurelia Context Chrome extension is a Chrome extension that lives in the side bar of the elements tab that highlights the current context of the selected element in the DOM.  It works by looking for the view model / context that is currently providing data-binding to the node.  It is in an early beta state and therefore needs to be installed manually instead of through the Chrome Web Store until it is ready for full release.

*Please feel free to open issues in the aurelia/tools repo with possible issues and / or contribute to it's development after signing the CLA*

**Installation**

1. Open your Chrome browser and enter `chrome://extensions` into the URL bar

2. Check the `Developer mode` box to allow adding extensions that aren't from Chrome store

3. Click 'Load Unpacked Extension'

4. Goto the `aurelia/tools/context-debugger` folder and open it

5. The extension should be loaded into your browser.

Right-click on an element and choose `Inspect Element` which should open the Chrome debugging tools.  On the right side pane you should now see an option for `Aurelia Properties` that shows what is currently available.
