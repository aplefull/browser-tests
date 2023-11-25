export const MathMlf2 = () => {
  const rows = 30;
  const cols = 30;

  const data = Array.from(Array(rows).keys()).map((row) => {
    return Array.from(Array(cols).keys()).map((col) => {
      return row * cols + col + 1;
    });
  });

  const columnAlignString = 'center '.repeat(cols).trim();

  return (
    <math>
      <mrow>
        <mo fence="true" form="prefix">
          (
        </mo>
        <mtable columnalign={columnAlignString}>
          {data.map((row, rowIndex) => (
            <mtr key={rowIndex}>
              {row.map((value, index) => (
                <mtd key={index}>
                  <msup>
                    <mi>x</mi>
                    <mn>{value}</mn>
                  </msup>
                </mtd>
              ))}
            </mtr>
          ))}
        </mtable>
        <mo fence="true" form="postfix">
          )
        </mo>
      </mrow>
    </math>
  );
};
