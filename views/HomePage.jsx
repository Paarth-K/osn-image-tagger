import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import CloudinaryUploadWidget from "@/components/ImageUploader/CloudinaryUploadWidget";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
export default function HomePage() {
  const [imageURL, setImageURL] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsStore, setTagsStore] = useState("");
  const [buttonText, setButtonText] = useState("Tag");
  useEffect(() => {
    console.log("Image URL: ", imageURL);
  }, [imageURL]);

  const tagImage = useDebouncedCallback(async () => {
    const res = await fetch("/api/tag", {
      method: "POST",
      body: JSON.stringify({
        imageURL: `https://wsrv.nl/?url=${imageURL}`,
      }),
    });
    setButtonText("Tag");
    // console.log(await res.json());

    const data = await res.json();
    if (res.status == 200) {
      setTags(data.tags);
      setTagsStore(data.tags);
      console.log(tags);
      return;
    } else {
      console.error("Failed to tag image");
      setSummarizedText(`Failed to summarize text. Status Code: ${res.status}`);
      setTimeout(() => {
        setSummarizedText("Old Tags: " + summarizedTextStore);
      }, 2000);
    }
  }, 300);

  return (
    <div className={styles.homePage}>
      <p className={styles.title}>OSN Image Tagger</p>
      <div className={styles.mainLayout}>
        <div>
          {imageURL ? (
            <>
              <Image
                width={500}
                height={400}
                className={styles.image}
                src={`https://wsrv.nl/?url=${imageURL}`}
              ></Image>
              <p
                onClick={() => {
                  setImageURL("");
                }}
                className={styles.removeImage}
                style={{ cursor: "pointer", fontWeight: "500" }}
              >
                Remove above image
              </p>
            </>
          ) : (
            <CloudinaryUploadWidget
              afterFunction={(uploadedImageURL) => {
                setImageURL(uploadedImageURL);
              }}
              uploadPreset="i0pm8feq"
              onePhoto={true}
              autoMinimize={true}
              fullLink={true}
            >
              <div className={styles.previewImageSkeleton}>Upload an image</div>
            </CloudinaryUploadWidget>
          )}
        </div>
        <div>
          {imageURL ? (
            <div
              onClick={() => {
                tagImage();
                setButtonText("Tagging...");
              }}
              className={styles.convertButton}
            >
              {buttonText}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.tags}>
          <p>{tags}</p>
        </div>
      </div>
    </div>
  );
}
