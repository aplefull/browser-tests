export const MathMlf1 = () => {
  return (
    <math>
      <mrow>
        <msub>
          <mi>f</mi>
          <mn>1</mn>
        </msub>
        <mo form="prefix" stretchy="false">
          (
        </mo>
        <mi>x</mi>
        <mo form="postfix" stretchy="false">
          )
        </mo>
        <mo>=</mo>
        <mrow>
          <munderover>
            <mo movablelimits="false">∑</mo>
            <mrow>
              <mi>n</mi>
              <mo>=</mo>
              <mrow>
                <mo fence="true" form="prefix">
                  ⌊
                </mo>
                <msubsup>
                  <mo movablelimits="false">∏</mo>
                  <mrow>
                    <mi>k</mi>
                    <mo>=</mo>
                    <mn>0</mn>
                  </mrow>
                  <mrow>
                    <mo fence="true" form="prefix">
                      ⌊
                    </mo>
                    <msup>
                      <mi>x</mi>
                      <mn>2</mn>
                    </msup>
                    <mo fence="true" form="postfix">
                      ⌋
                    </mo>
                  </mrow>
                </msubsup>
                <mfrac>
                  <mrow>
                    <mi>π</mi>
                    <msqrt>
                      <msup>
                        <mi>x</mi>
                        <mi>τ</mi>
                      </msup>
                    </msqrt>
                  </mrow>
                  <mrow>
                    <msubsup>
                      <mo movablelimits="false">∫</mo>
                      <mn>0</mn>
                      <mrow>
                        <mn>3</mn>
                        <msqrt>
                          <mrow>
                            <mrow>
                              <mo fence="true" form="prefix">
                                |
                              </mo>
                              <mi>x</mi>
                              <mo fence="true" form="postfix">
                                |
                              </mo>
                            </mrow>
                            <mi>τ</mi>
                          </mrow>
                        </msqrt>
                      </mrow>
                    </msubsup>
                    <mrow>
                      <mi>erf</mi>
                      <mo>⁡</mo>
                    </mrow>
                    <mo form="prefix" stretchy="false">
                      (
                    </mo>
                    <mrow>
                      <mi>csc</mi>
                      <mo>⁡</mo>
                    </mrow>
                    <mo form="prefix" stretchy="false">
                      (
                    </mo>
                    <mi>k</mi>
                    <mo>*</mo>
                    <mi>x</mi>
                    <mo form="postfix" stretchy="false">
                      )
                    </mo>
                    <mo form="postfix" stretchy="false">
                      )
                    </mo>
                    <mo form="postfix" stretchy="false">
                      )
                    </mo>
                  </mrow>
                </mfrac>
                <mo fence="true" form="postfix">
                  ⌋
                </mo>
              </mrow>
            </mrow>
            <mrow>
              <mo fence="true" form="prefix">
                ⌈
              </mo>
              <mrow>
                <mi mathvariant="normal">Γ</mi>
              </mrow>
              <mo form="prefix" stretchy="false">
                (
              </mo>
              <msubsup>
                <mo movablelimits="false">∑</mo>
                <mrow>
                  <mi>k</mi>
                  <mo>=</mo>
                  <mn>1</mn>
                </mrow>
                <mrow>
                  <mo fence="true" form="prefix">
                    ⌈
                  </mo>
                  <msup>
                    <mi>x</mi>
                    <mrow>
                      <mn>3</mn>
                      <mi>π</mi>
                    </mrow>
                  </msup>
                  <mo fence="true" form="postfix">
                    ⌉
                  </mo>
                </mrow>
              </msubsup>
              <mrow>
                <mi>sin</mi>
                <mo>⁡</mo>
              </mrow>
              <mo form="prefix" stretchy="false">
                (
              </mo>
              <mi>x</mi>
              <mo form="postfix" stretchy="false">
                )
              </mo>
              <mo form="postfix" stretchy="false">
                )
              </mo>
              <mo fence="true" form="postfix">
                ⌉
              </mo>
            </mrow>
          </munderover>
        </mrow>
        <msqrt>
          <mrow>
            <msubsup>
              <mo movablelimits="false">∫</mo>
              <mrow>
                <msubsup>
                  <mo movablelimits="false">∫</mo>
                  <mi>x</mi>
                  <mi>n</mi>
                </msubsup>
                <mfrac>
                  <mi>x</mi>
                  <mrow>
                    <mrow>
                      <mi mathvariant="normal">Γ</mi>
                    </mrow>
                    <mo form="prefix" stretchy="false">
                      (
                    </mo>
                    <mi>x</mi>
                    <mo form="postfix" stretchy="false">
                      )
                    </mo>
                  </mrow>
                </mfrac>
              </mrow>
              <msubsup>
                <mrow>
                  <mi mathvariant="normal">C</mi>
                </mrow>
                <mi>n</mi>
                <mrow>
                  <mrow>
                    <mspace width="0.1667em"></mspace>
                    <mi>min</mi>
                    <mo>⁡</mo>
                  </mrow>
                  <mo form="prefix" stretchy="false">
                    (
                  </mo>
                  <mi>n</mi>
                  <mo separator="true">,</mo>
                  <mrow>
                    <mo fence="true" form="prefix">
                      |
                    </mo>
                    <mrow>
                      <mi>erf</mi>
                      <mo>⁡</mo>
                    </mrow>
                    <mo form="prefix" stretchy="false">
                      (
                    </mo>
                    <mtext>argsinh</mtext>
                    <mo form="prefix" stretchy="false">
                      (
                    </mo>
                    <mi>n</mi>
                    <mo form="postfix" stretchy="false">
                      )
                    </mo>
                    <mo form="postfix" stretchy="false">
                      )
                    </mo>
                    <mo fence="true" form="postfix">
                      |
                    </mo>
                  </mrow>
                  <mo form="postfix" stretchy="false">
                    )
                  </mo>
                </mrow>
              </msubsup>
            </msubsup>
            <mrow>
              <mo fence="true" form="prefix">
                |
              </mo>
              <mtable columnalign="center center center">
                <mtr>
                  <mtd>
                    <mi>π</mi>
                  </mtd>
                  <mtd>
                    <mi>τ</mi>
                  </mtd>
                  <mtd>
                    <msqrt>
                      <msup>
                        <mrow>
                          <mi mathvariant="normal">e</mi>
                        </mrow>
                        <mi>n</mi>
                      </msup>
                    </msqrt>
                  </mtd>
                </mtr>
                <mtr>
                  <mtd>
                    <mi>n</mi>
                  </mtd>
                  <mtd>
                    <msup>
                      <mi>n</mi>
                      <mrow>
                        <mrow>
                          <mspace width="0.1667em"></mspace>
                          <mi>ln</mi>
                          <mo>⁡</mo>
                        </mrow>
                        <mo form="prefix" stretchy="false">
                          (
                        </mo>
                        <mi>x</mi>
                        <mo form="postfix" stretchy="false">
                          )
                        </mo>
                      </mrow>
                    </msup>
                  </mtd>
                  <mtd>
                    <mi>π</mi>
                  </mtd>
                </mtr>
                <mtr>
                  <mtd>
                    <mn>8</mn>
                  </mtd>
                  <mtd>
                    <mfrac>
                      <mi>n</mi>
                      <mrow>
                        <msubsup>
                          <mo movablelimits="false">∫</mo>
                          <mn>0</mn>
                          <mi>n</mi>
                        </msubsup>
                        <mroot>
                          <mi>x</mi>
                          <mi>n</mi>
                        </mroot>
                      </mrow>
                    </mfrac>
                  </mtd>
                  <mtd>
                    <mrow>
                      <mo fence="true" form="prefix">
                        |
                      </mo>
                      <mtable columnalign="center center">
                        <mtr>
                          <mtd>
                            <mi>n</mi>
                          </mtd>
                          <mtd>
                            <mi>x</mi>
                          </mtd>
                        </mtr>
                        <mtr>
                          <mtd>
                            <mroot>
                              <mi>n</mi>
                              <mrow>
                                <msubsup>
                                  <mo movablelimits="false">∫</mo>
                                  <mi>x</mi>
                                  <msup>
                                    <mi>x</mi>
                                    <mn>2</mn>
                                  </msup>
                                </msubsup>
                                <mrow>
                                  <mi>sin</mi>
                                  <mo>⁡</mo>
                                </mrow>
                                <mo form="prefix" stretchy="false">
                                  (
                                </mo>
                                <mi>x</mi>
                                <mo form="postfix" stretchy="false">
                                  )
                                </mo>
                              </mrow>
                            </mroot>
                          </mtd>
                          <mtd>
                            <mi>π</mi>
                          </mtd>
                        </mtr>
                      </mtable>
                      <mo fence="true" form="postfix">
                        |
                      </mo>
                    </mrow>
                  </mtd>
                </mtr>
              </mtable>
              <mo fence="true" form="postfix">
                |
              </mo>
            </mrow>
          </mrow>
        </msqrt>
      </mrow>
    </math>
  );
};
