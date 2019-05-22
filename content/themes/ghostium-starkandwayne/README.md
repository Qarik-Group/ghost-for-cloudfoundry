# Theme for starkandwayne.com/blog (from Ghostium)

This is the theme for starkandwayne.com/blog.

To update the theme:

1. Make edits to files within `src/` only. Do not manually edit `assets/`. This folder is generated from `src/`.
1. Use nodejs/yarn to compile the JavaScript/CSS and generate updated Ghost templates to reference these files.

    ```plain
    npm install -g grunt gscan
    yarn install
    npm run-script build
    ```

Note, this toolchain also requires Ruby/RubyGems to install the `sass` and `csscss` CLIs that are used.
