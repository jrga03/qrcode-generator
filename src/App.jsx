import { useReducer, useRef } from "react";
import {
  Button,
  FormGroup,
  H1,
  InputGroup,
  Intent,
  NumericInput,
  Radio,
  RadioGroup,
  Slider,
  Switch,
} from "@blueprintjs/core";
import clsx from "clsx";
import { BlockPicker } from "react-color";

import QRCodeComponent from "./components/qrcode";

/**
 * @desc Read a file as a data uri
 * @param {Blob} inputFile Input File Object
 * @return {Promise<string>}
 * */
const readAsDataURI = (inputFile) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => resolve(e.target.result));
    fileReader.addEventListener("error", reject);
    fileReader.readAsDataURL(inputFile);
  });

function reducer(state, action) {
  switch (action.type) {
    case "change": {
      const { field, value } = action;
      return {
        ...state,
        [field]: value,
      };
    }
    case "bulk_change": {
      const { values } = action;
      return {
        ...state,
        ...values,
      };
    }
    default:
      return state;
  }
}

const initialState = {
  text: "https://www.google.com/",
  size: 500,
  correctLevel: "H",
  colorDark: "#000000",
  colorLight: "#ffffff",
  dotScale: 1,
  quietZone: 0,
  logo: null,
  logoWidth: 50,
  logoHeight: 50,
  logoBackgroundTransparent: false,
  logoBackgroundColor: "#ffffff",
  backgroundImage: null,
  backgroundImageAlpha: 1,
  downloadFilename: "qrcode",
};

function App() {
  const qrCodeRef = useRef(null);
  const qrInstanceRef = useRef(null);
  const logoRef = useRef(null);
  const bgImageRef = useRef(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeInput = (e) => {
    dispatch({
      type: "change",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const onChangeSwitch = (e) => {
    dispatch({
      type: "change",
      field: e.target.name,
      value: e.target.checked,
    });
  };

  const onChangeNumeric = (value, valueStr, inputElem) => {
    dispatch({
      type: "change",
      field: inputElem.name,
      value,
    });
  };

  const onChangeSlider = (name) => (value) => {
    dispatch({
      type: "change",
      field: name,
      value,
    });
  };

  const onChangeColor = (name) => (value) => {
    dispatch({
      type: "change",
      field: name,
      value: value.hex,
    });
  };

  const onChangeLogo = async (e) => {
    const { files } = e.target;

    if (files.length > 0) {
      const file = files[0];
      const dataUri = await readAsDataURI(file);

      dispatch({
        type: "bulk_change",
        values: {
          logo: dataUri,
          logoWidth: Math.floor(state.size / 3.5),
          logoHeight: Math.floor(state.size / 3.5),
        },
      });
    }
  };

  const onClickClearLogo = () => {
    dispatch({
      type: "bulk_change",
      values: {
        logo: null,
        logoWidth: 50,
        logoHeight: 50,
      },
    });

    logoRef.current.value = "";
    if (!/safari/i.test(navigator.userAgent)) {
      logoRef.current.type = "";
      logoRef.current.type = "file";
    }
  };

  const onChangeBgImage = async (e) => {
    const { files } = e.target;

    if (files.length > 0) {
      const file = files[0];
      const dataUri = await readAsDataURI(file);

      dispatch({
        type: "bulk_change",
        values: {
          backgroundImage: dataUri,
          backgroundImageAlpha: 1,
        },
      });
    }
  };

  const onClickClearBgImage = () => {
    dispatch({
      type: "bulk_change",
      values: {
        backgroundImage: null,
        backgroundImageAlpha: 1,
      },
    });

    bgImageRef.current.value = "";
    if (!/safari/i.test(navigator.userAgent)) {
      bgImageRef.current.type = "";
      bgImageRef.current.type = "file";
    }
  };

  const onClickDownload = () => {
    qrInstanceRef.current?.download(state.downloadFilename);
  };

  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full flex justify-center overflow-auto">
        <main className="container px-4 py-10 flex flex-col">
          <H1>QR Code Generator</H1>

          <div className="grid grid-cols-2 gap-x-4">
            <FormGroup className="col-span-2" label="Text" labelFor="text">
              <InputGroup id="text" name="text" value={state.text} onChange={onChangeInput} />
            </FormGroup>

            <FormGroup className="col-span-2" label="Size" labelFor="size">
              <NumericInput
                id="size"
                name="size"
                value={state.size}
                onValueChange={onChangeNumeric}
                fill
                allowNumericCharactersOnly
                min={1}
                max={Number.MAX_SAFE_INTEGER}
                clampValueOnBlur
              />
            </FormGroup>

            <RadioGroup
              className="col-span-2"
              name="correctLevel"
              label="Correction Level"
              onChange={onChangeInput}
              selectedValue={state.correctLevel}
              inline
            >
              <Radio label="L" value="L" />
              <Radio label="M" value="M" />
              <Radio label="Q" value="Q" />
              <Radio label="H" value="H" />
            </RadioGroup>

            <div className="mb-4">
              <label className="block mb-1">Color Dark</label>
              <BlockPicker
                color={state.colorDark}
                onChange={onChangeColor("colorDark")}
                onChangeComplete={onChangeColor("colorDark")}
                triangle="hide"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Color Light</label>
              <BlockPicker
                color={state.colorLight}
                onChange={onChangeColor("colorLight")}
                onChangeComplete={onChangeColor("colorLight")}
                triangle="hide"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Dot Scale</label>
              <div className="px-4">
                <Slider
                  value={state.dotScale}
                  onChange={onChangeSlider("dotScale")}
                  onRelease={onChangeSlider("dotScale")}
                  min={0.1}
                  max={1}
                  stepSize={0.05}
                  labelRenderer={false}
                />
              </div>
            </div>

            <FormGroup label="Quiet Zone" labelFor="quietZone">
              <NumericInput
                id="quietZone"
                name="quietZone"
                value={state.quietZone}
                onValueChange={onChangeNumeric}
                fill
                allowNumericCharactersOnly
                min={0}
                max={Number.MAX_SAFE_INTEGER}
                clampValueOnBlur
              />
            </FormGroup>

            <div className="mb-4 col-span-2">
              <div className="mb-1">
                <label htmlFor="logo">Logo</label>
                {state.logo && (
                  <button
                    className="ml-4 text-blue-600 italic text-xs underline"
                    onClick={onClickClearLogo}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-row items-center">
                <input
                  type="file"
                  id="logo"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={onChangeLogo}
                  ref={logoRef}
                />

                <div className="object-contain h-12 w-12">
                  {state.logo && <img className="w-full h-full" src={state.logo} />}
                </div>
              </div>
            </div>

            {state.logo && (
              <>
                <FormGroup label="Logo Width" labelFor="logoWidth">
                  <NumericInput
                    id="logoWidth"
                    name="logoWidth"
                    value={state.logoWidth}
                    onValueChange={onChangeNumeric}
                    fill
                    allowNumericCharactersOnly
                    min={0}
                    max={Math.floor(state.size / 3.5)}
                    clampValueOnBlur
                    stepSize={1}
                  />
                </FormGroup>

                <FormGroup label="Logo Height" labelFor="logoHeight">
                  <NumericInput
                    id="logoHeight"
                    name="logoHeight"
                    value={state.logoHeight}
                    onValueChange={onChangeNumeric}
                    fill
                    allowNumericCharactersOnly
                    min={0}
                    max={Math.floor(state.size / 3.5)}
                    clampValueOnBlur
                    stepSize={1}
                  />
                </FormGroup>

                <Switch
                  name="logoBackgroundTransparent"
                  label="Logo background transparent?"
                  large
                  onChange={onChangeSwitch}
                  checked={state.logoBackgroundTransparent}
                />

                <div
                  className={clsx("mb-4", {
                    "text-gray-600": state.logoBackgroundTransparent,
                    "cursor-not-allowed": state.logoBackgroundTransparent,
                    "opacity-60": state.logoBackgroundTransparent,
                  })}
                >
                  <label
                    className={clsx("block mb-1", {
                      "cursor-not-allowed": state.logoBackgroundTransparent,
                    })}
                  >
                    Logo BG color
                  </label>
                  <div className="flex items-center">
                    <input
                      id="logoBackgroundColor"
                      name="logoBackgroundColor"
                      type="color"
                      value={state.logoBackgroundColor}
                      onChange={onChangeInput}
                      disabled={state.logoBackgroundTransparent}
                      className="disabled:cursor-not-allowed"
                    />
                    <label
                      htmlFor="logoBackgroundColor"
                      className={clsx("ml-2 uppercase", {
                        "cursor-not-allowed": state.logoBackgroundTransparent,
                      })}
                    >
                      {state.logoBackgroundColor}
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="mb-4">
              <div className="mb-1">
                <label htmlFor="backgroundImage">Background Image</label>
                {state.backgroundImage && (
                  <button
                    className="ml-4 text-blue-600 italic text-xs underline"
                    onClick={onClickClearBgImage}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-row items-center">
                <input
                  type="file"
                  id="backgroundImage"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={onChangeBgImage}
                  ref={bgImageRef}
                />

                <div className="object-contain h-12 w-12">
                  {state.backgroundImage && (
                    <img className="w-full h-full" src={state.backgroundImage} />
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Background Image Alpha</label>
              <div className="px-4">
                <Slider
                  value={state.backgroundImageAlpha}
                  onChange={onChangeSlider("backgroundImageAlpha")}
                  onRelease={onChangeSlider("backgroundImageAlpha")}
                  min={0}
                  max={1}
                  stepSize={0.05}
                  labelRenderer={false}
                  disabled={!state.backgroundImage}
                />
              </div>
            </div>

            <FormGroup className="col-span-2" label="Download Filename" labelFor="downloadFilename">
              <InputGroup
                id="downloadFilename"
                name="downloadFilename"
                value={state.downloadFilename}
                onChange={onChangeInput}
              />
            </FormGroup>
          </div>

          <div className="flex justify-center py-20 my-2 bg-gray-100">
            <QRCodeComponent {...state} ref={qrCodeRef} qrRef={qrInstanceRef} />
          </div>

          <Button text="Download" intent={Intent.PRIMARY} large onClick={onClickDownload} />
        </main>
      </div>
    </div>
  );
}

export default App;
