.PHONY: all dark light clean open watch install

# Files
HTML_DARK = sustainability-lab-join-us-poster.html
HTML_LIGHT = sustainability-lab-join-us-poster-light.html
PDF_DARK = sustainability-lab-join-us-poster.pdf
PDF_LIGHT = sustainability-lab-join-us-poster-light.pdf
SCRIPT_DARK = generate-pdf-dark.mjs
SCRIPT_LIGHT = generate-pdf.mjs

# Default target
all: dark light

# Install dependencies
install:
	npm install

# Generate dark theme PDF
dark: $(PDF_DARK)

$(PDF_DARK): $(HTML_DARK) $(SCRIPT_DARK)
	node $(SCRIPT_DARK)

# Generate light theme PDF
light: $(PDF_LIGHT)

$(PDF_LIGHT): $(HTML_LIGHT) $(SCRIPT_LIGHT)
	node $(SCRIPT_LIGHT)

# Clean generated PDFs
clean:
	rm -f $(PDF_DARK) $(PDF_LIGHT)

# Open PDFs in default viewer
open: all
	open $(PDF_DARK) $(PDF_LIGHT)

# Watch mode - regenerate on HTML changes
watch:
	@which fswatch >/dev/null 2>&1 || (echo "Error: fswatch not installed. Install with: brew install fswatch" && exit 1)
	fswatch -o $(HTML_DARK) $(HTML_LIGHT) | xargs -n1 -I{} make all
