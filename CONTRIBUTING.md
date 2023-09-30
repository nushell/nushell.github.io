# Contributing

If you want to contribute to nushell itself, see [nushell/nushell/CONTRIBUTING.md](https://github.com/nushell/nushell/blob/master/CONTRIBUTING.md) and the [contributor-book](https://www.nushell.sh/contributor-book/).

This website is based on Vuepress.

## Running Vuepress locally

1. [Install Node.js](https://nodejs.org/en/download/), the minimum version required: v18.12.0
2. Run `npm install`
3. Run `npm run dev`

If you're adding a new page to the book, to make it appear, put it also to `.vuepress/configs/sidebar/{locale}.ts`.

## Translation Guide

1. First of all, make sure you have installed `node.js`, `yarn`, and then clone the doc repo locally:
   `git clone git@github.com:nushell/nushell.github.io.git nu-docs`;
2. Run `yarn install` in `nu-docs` dir after your cloning;
3. Add a book dir(if not exists) for the specified locale in the docs' root folder, say `zh-CN`, and then create a `book` child folder for all your translated documents, and a README.md for the home page of your locale;
4. Modify the vuepress config file `nu-docs/.vuepress/config.js`, add `zh-CN` related configs, here is a [commit](https://github.com/nushell/nushell.github.io/commit/46d1672) for reference;
5. Add README.md in the `book` dir, and that will be the default introduction page of Nushell. Note: Please **DO NOT** translate the file name of the docs.
6. Run `yarn vuepress dev`, then open **http://localhost:8080/** in your browser, switch to the language you are going to translate into, and you will see the introduction page you have just created. You can translate the docs and save them to get a preview in the browser;
7. Update the `nu-docs/i18n-meta.json` file, fill the locale value of the doc you have just finished. It's recommended to use `commit_id@author` or simply a `commit_id` to indicate your translation end to the specified commit;
8. Commit your changes, It's recommended to squash all your commits in one commit with a commit message like this: `Translate your_doc_file.md to zh-CN from commit: f3dc86d3d`;
9. Send a Pull Request;
10. Check outdated translations: You can use a command like `nu ./i18n.nu outdated zh-CN` to check the outdated translations(documents have been changed after your last translation) for the specified locale.
