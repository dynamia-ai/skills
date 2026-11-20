---
name: feishu-pdf-export
description: Use when a Feishu document or wiki URL needs to be exported to a local PDF, or when checking a Feishu PDF for missing content, literal markup, or layout problems.
---

# Export Feishu documents to PDF

## Prepare

Get the document or wiki URL and confirm that the configured Feishu identity has read access. Use `feishu-docx` with its PDF extra and install Poppler for `pdfinfo`, `pdftotext`, and `pdftoppm`. See [exporter setup](references/setup.md) for a tested revision, authentication, and native library setup.

## Export

Use a fresh directory for each document. Set `doc_url` to the source URL before running the export.

```sh
output_dir="$(mktemp -d "${TMPDIR:-/tmp}/feishu-pdf.XXXXXX")"
feishu-docx export "$doc_url" -o "$output_dir" -n source --pdf --debug
find "$output_dir" -type f -name '*.pdf' -print
```

Allow the export to finish before checking its output. Require a successful exit and exactly one PDF in the output directory. If there are zero or multiple PDFs, inspect the export logs and output before continuing. Keep the Markdown and the debug HTML next to the PDF for comparison.

For custom styling, add `--pdf-template /path/to/template.css`. For the [Dynamia template](assets/dynamia.css), resolve that path from the installed skill directory. Add `--pdf-logo /path/to/logo.svg` only if a local logo is available, or use `--syntax-style solarized-light` to change code highlighting. The Dynamia template uses A4 pages. Inspect wide tables, long identifiers, and dense screenshots at reading size.

## Check the PDF

Set `pdf` to the path of the single exported PDF. To check an existing PDF, set `pdf` to its path and create a fresh `output_dir` with the same `mktemp` command. Use the original document or intermediate files for comparison when available, and report which source comparisons were unavailable.

Confirm that the signature is `%PDF-`, `pdfinfo` reports a positive page count, and the extracted text contains the expected body content.

```sh
test -s "$pdf"
head -c 5 "$pdf"
pdfinfo "$pdf"
pdftotext -layout "$pdf" "$output_dir/pdf.txt"
grep -q '[^[:space:]]' "$output_dir/pdf.txt"
grep -nF -e '<br>' -e '&lt;br&gt;' -e '**' "$output_dir/pdf.txt"
```

For the marker scan, `grep` exits with code 1 when it finds no matches. Review each match against the Markdown, HTML, and rendered page. A code example may intentionally show one of these markers. Also compare important commands, version strings, tables, and continued list numbering with the source. Check names and mentions against the Feishu document if the exporter reported access errors resolving them.

Render every page and inspect it at a readable size.

```sh
mkdir -p "$output_dir/previews"
pdftoppm -png -r 120 "$pdf" "$output_dir/previews/page"
# Re-render page 8 at a higher resolution if that page needs closer inspection.
pdftoppm -f 8 -l 8 -singlefile -png -r 180 "$pdf" "$output_dir/previews/page-8-detail"
```

Look for missing glyphs or images, clipped or overlapping content, unreadable table columns or screenshot labels, broken command wrapping, and unexpected blank pages. If a check fails, keep the original files, report the affected pages and symptoms, then repeat the text and visual checks after any correction. Provide the local PDF path and report which checks were completed.
