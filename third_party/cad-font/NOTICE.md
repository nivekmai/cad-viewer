# CAD outline font

`app/src/main/resources/cad-font.bin` contains flattened outlines derived from DejaVu Sans, distributed under the accompanying Bitstream Vera license (DejaVu changes are public domain). It is a substitute font, not an implementation of drawing-specific SHX or TTF text styles.

Source font: `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`.
SHA-256: `b4c632e3cdf9acc7f28758fb5a323c8524d7fc6660d46904d9b6cbe2809c419c`.

Regenerate using JDK 21:

```
java -Djava.awt.headless=true tools/GenerateCadFont.java /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf app/src/main/resources/cad-font.bin
```

The bundled format stores Unicode code points, advance widths, and outline segments in cap-height units. Java AWT is used only by the generator and desktop preview utility; neither is compiled into the Android application.

Parser reference: Autodesk DXF documentation for TEXT, MTEXT, and common DIMENSION group codes. Dimension previews use group 2's saved anonymous block, not a recomputed measurement.
