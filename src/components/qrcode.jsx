import { forwardRef, memo, useEffect } from "react";
import QRCode from "easyqrcodejs";

const QRCodeComponent = memo(
  forwardRef((props, ref) => {
    useEffect(() => {
      if (ref.current) {
        // Clear the previous QR code if it exists
        ref.current.innerHTML = "";

        const {
          text,
          size,
          colorDark,
          colorLight,
          correctLevel,
          dotScale,
          quietZone,
          logo,
          logoWidth,
          logoHeight,
          logoBackgroundTransparent,
          logoBackgroundColor,
          backgroundImage,
          backgroundImageAlpha,
        } = props;

        // Options for QR code generation
        const options = {
          text,
          width: size,
          height: size,
          colorDark,
          colorLight,
          correctLevel: QRCode.CorrectLevel[correctLevel],
          dotScale,
          dotScaleTiming: dotScale,
          dotScaleA: dotScale,
          quietZone,
          quietZoneColor: colorLight,
          logo,
          logoWidth: Math.min(Math.max(logoWidth, 0), size / 3.5),
          logoHeight: Math.min(Math.max(logoHeight, 0), size / 3.5),
          logoBackgroundTransparent,
          logoBackgroundColor,
          backgroundImage,
          backgroundImageAlpha,
        };

        // Generate QR code
        props.qrRef.current = new QRCode(ref.current, options);
      }
    }, [props, ref]);

    return <div id="qr-container" ref={ref} />;
  })
);
QRCodeComponent.displayName = "QRCodeComponent";

export default QRCodeComponent;
