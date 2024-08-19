# Contributing

If you want to contribute to Nushell itself, see [nushell/nushell/CONTRIBUTING.md](https://github.com/nushell/nushell/blob/master/CONTRIBUTING.md) and the [contributor-book](https://www.nushell.sh/contributor-book/).

If you want to contribute to the Nushell documentation and website, this is the right place.

::: warning Important
While most documentation is updated via commits to this repository, an important exception is the `help` [documentation for all commands](/commands).
These pages are generated automatically from the internal help in each command's `.rs` file. Please see the [main Nushell repo](https://github.com/nushell/nushell) and submit pull requests for changes to *command* documentation there.
:::

## Local Development

This website is based on VuePress.

## Getting started
### One-time Setup

1. First of all, make sure you have installed `node.js`(v18.12.0 or above)
1. Create a fork of the (website repository)(https://github.com/nushell/nushell.github.io)
1. Clone the doc repo locally:

   ```nu
   git clone git@github.com:nushell/nushell.github.io.git nu-docs
   ```


1. [Install Node.js](https://nodejs.org/en/download/), the minimum version required: v18.12.0
2. Run `npm install` in the root of the local repo after cloning to install the required dependencies for the dev server. This will also be necessary if any dependencies change.

### For each group of changes

1. Sync your fork on GitHub
1. `git pull` the latest changes
1. Run `npm run dev`

   ::: tip
   Pay close attention to the messages when starting the server, as this will inform you of any broken links and other errors that might need to be fixed.
   :::

1. Create a branch for your changes using a short, descriptive name:

   ```nu
   git checkout -b my_changes
   ```

1. If you're adding a new page to the book, to make it appear, put it also to `.vuepress/configs/sidebar/{locale}.ts`.
2. Make changes
3. Verify your local changes render correctly using a web browser pointing to the local dev server site
4. Commit and push your changes

   ```nu
   git commit -m "Commit Message"
   git push --set-upstream origin my_changes
   ```

   (Where `my_changes` is the current branch)

5. Create a pull request in this GitHub repo

## Enabling a Preview URL From Your Fork

Just enable GitHub actions in your repo settings. That's all! It will start deploying the next time you push to `main`.


### Display Nu Code Snippets With Syntax Highlighting

To display Nushell code snippets with syntax highlighting support you can wrap the Nu codes with \```nu \``` or \```nushell \```, for example:

```nu
# List the top five largest files
ls | where type == file | sort-by -r size | first 5
```

The preferred form for consistency is \```nu

## Translation Guide

Follow the steps above for each group of translations.

### Adding to or updating existing translations

* Check outdated translations. A helper script is provided for this. From the repository root, run:

```nu
nu tools/i18n.nu outdated zh-CN
```

 This will provide a list of all files that have been changed or added since the last translation update for the specified locale.


### Creating a new translation

1. Add a book dir for the specified locale in the docs' root folder, say `zh-CN`.
1. Create a `book` child folder for all your translated documents and a README.md for the home page of your locale
4. Modify the VuePress config file `.vuepress/config.js` and add `zh-CN` related configs.

   Here is an example [commit](https://github.com/nushell/nushell.github.io/commit/46d1672) for reference.

5. Add a `README.md` in the `book` dir which will be the default introduction page of Nushell. 

   ::: warning Important
   Please **DO NOT** translate the file name of the docs.
   :::

6. Run `npm run dev`, then open **http://localhost:8080/** in your browser
1. Switch to the language you are going to translate into, and you will see the introduction page you have just created. You can translate the docs and save them to get a preview in the browser.

7. Update the `i18n-meta.json` file by filling in the locale value of the doc you have just finished. It's recommended to use `commit_id@author` or simply a `commit_id` to indicate your translation end to the specified commit.
8. Commit your changes. It's recommended to squash all your commits in one commit with a commit message like this: `Translate your_doc_file.md to zh-CN from commit: f3dc86d3d`;
9. Push your changes as documented above
