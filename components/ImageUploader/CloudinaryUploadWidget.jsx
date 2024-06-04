"use client";

import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function CloudinaryUploadWidget({
  children,
  cloudName = "dflzkpttf",
  uploadPreset,
  cropRatio = false,
  afterFunction,
  onePhoto = false,
  autoMinimize = false,
  fullLink = false,
  optimizedLink = false,
  externalOpen = false,
}) {
  // Remove the comments from the code below to add
  // additional functionality.
  // Note that these are only a few examples, to see
  // the full list of possible parameters that you
  // can add see:
  //   https://cloudinary.com/documentation/upload_widget_reference
  const [myWidget, setMyWidget] = useState("");
  useEffect(() => {
    setMyWidget(
      window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          cropping: cropRatio ? true : false,
          croppingAspectRatio: cropRatio,
          showSkipCropButton: cropRatio ? false : true,
          autoMinimize: { autoMinimize },
          // showAdvancedOptions: true,  //add advanced options (public_id and tag)
          // sources: [ "local", "url"], // restrict the upload sources to URL and local files
          multiple: !onePhoto, //restrict upload to a single file
          // folder: "user_images", //upload files to the specified folder
          // tags: ["users", "profile"], //add the given tags to the uploaded files
          // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
          // clientAllowedFormats: ["images"], //restrict uploading to image files only
          // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
          // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
          // theme: "purple", //change to a purple theme
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            // console.log("Done! Here is the image info: ", result.info);
            if (fullLink) {
              afterFunction(result.info.secure_url);
            } else if (optimizedLink) {
              // console.log(
              //   "https://res.cloudinary.com/dfIzkpttf/image/upload/f_auto,q_auto,w_auto,dpr_auto/" +
              //     result.info.path
              // );
              afterFunction(
                "https://res.cloudinary.com/dfIzkpttf/image/upload/f_auto,q_auto,w_auto,dpr_auto/" +
                  result.info.path
              );
            } else {
              afterFunction(result.info.path);
            }
          }
        }
      )
    );
  }, []);
  useEffect(() => {
    if (externalOpen) {
      externalOpen(myWidget);
    }
  }, [externalOpen]);

  return (
    <div>
      <div
        onClick={() => {
          myWidget.open();
        }}
      >
        {children}
      </div>
    </div>
  );
}
