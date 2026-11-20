# Set up the Feishu PDF exporter

## Install the exporter

Use the upstream revision below for an export that preserves continued ordered-list numbering. The [v0.2.8 release](https://github.com/leemysw/feishu-docx/releases/tag/v0.2.8) fixes literal table line breaks and inline formatting markers. The [ordered-list fix](https://github.com/leemysw/feishu-docx/pull/38) merged after that release.

Use [uv](https://docs.astral.sh/uv/) to install into a temporary virtual environment. Run the export in the same shell so that it uses this environment.

```sh
exporter_dir="$(mktemp -d "${TMPDIR:-/tmp}/feishu-docx.XXXXXX")"
uv venv "$exporter_dir/venv"
uv pip install --python "$exporter_dir/venv/bin/python" \
  'feishu-docx[pdf] @ git+https://github.com/leemysw/feishu-docx.git@ce5a23381e814f282e09f3fc15ffda2870a2159e'
. "$exporter_dir/venv/bin/activate"
feishu-docx export --help
```

Confirm that the help includes `--pdf`, `--debug`, `--pdf-template`, and `--pdf-logo`. Install Poppler with your package manager if `pdfinfo`, `pdftotext`, or `pdftoppm` is missing.

On macOS, if WeasyPrint fails to load a library such as `libgobject-2.0-0`, install the Homebrew libraries and retry in the same shell.

```sh
brew install glib cairo pango gdk-pixbuf libffi
export DYLD_FALLBACK_LIBRARY_PATH="$(brew --prefix)/lib"
```

If running through a shell wrapper clears `DYLD_FALLBACK_LIBRARY_PATH`, invoke the virtual environment's Python directly. Pass the URL and export options after `export`.

```sh
"$exporter_dir/venv/bin/python" -c 'from feishu_docx.cli.main import app; app()' export --help
```

## Configure source access

Use an existing authorized `feishu-docx` configuration or set `FEISHU_APP_ID` and `FEISHU_APP_SECRET` in the environment. The app or user needs read access to the selected document and its media. For tenant permissions and OAuth setup, see the [feishu-docx authentication guide](https://github.com/leemysw/feishu-docx#-authentication-modes).
