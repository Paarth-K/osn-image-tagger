import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import CloudinaryUploadWidget from "@/components/ImageUploader/CloudinaryUploadWidget";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
export default function HomePage() {
  const [imageURL, setImageURL] = useState("");
  const [data, setData] = useState(null);
  const [dataStore, setDataStore] = useState("");
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

    const data = JSON.parse(await res.json());
    console.log(data);

    if (res.status == 200) {
      setData(data);
      setDataStore(data);
      console.log(data);
      return;
    } else {
      console.error("Failed to tag image");
      //   setSummarizedText(`Failed to summarize text. Status Code: ${res.status}`);
      setData({
        tags: ["Failed to tag image"],
        description: "Failed to tag image",
        objects: ["Failed to tag image"],
      });
      setTimeout(() => {
        setData(dataStore);
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
        <div className={styles.aiData}>
          {data ? (
            <div>
              <p className={styles.subTitle}>Tags:</p>
              <div className={styles.tags}>
                {data.tags.map((tag) => {
                  return (
                    <p key={tag} className={styles.tag}>
                      {tag}
                    </p>
                  );
                })}
              </div>
              <p className={styles.subTitle}>Description:</p>
              <div className={styles.description}>
                <p>{data.description}</p>
              </div>
              <p className={styles.subTitle}>Objects Identified in Image:</p>
              <div className={styles.tags}>
                {data.objects.map((object) => {
                  return (
                    <p key={object} className={styles.tag}>
                      {object}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
