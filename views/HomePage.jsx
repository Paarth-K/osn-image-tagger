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
              <div>
                <p className={styles.subTitle}>Title:</p>
                <div className={styles.description}>
                  <p>{data.title}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>Media Type:</p>
                <div className={styles.description}>
                  <p>{data.mediaType}</p>
                </div>
              </div>
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
              </div>
              <div>
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
              <div>
                <p className={styles.subTitle}>
                  Sensitive Items Identified in Image:
                </p>
                <div className={styles.tags}>
                  {data.sensitiveTags.map((object) => {
                    return (
                      <p key={object} className={styles.tag}>
                        {object}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>Similar Media Based on Image:</p>
                <div className={styles.tags}>
                  {data.similarMedia.map((object) => {
                    return (
                      <p key={object} className={styles.tag}>
                        {object}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className={styles.line}></div>
              <div>
                <p className={styles.subTitle}>Inferred Synopsis:</p>
                <div className={styles.description}>
                  <p>{data.description}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>Pure Image Description:</p>
                <div className={styles.description}>
                  <p>{data.pureImageDescription}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>Short Marketing Message:</p>
                <div className={styles.description}>
                  <p>{data.marketingMessageShort}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>Long Marketing Message:</p>
                <div className={styles.description}>
                  <p>{data.marketingMessageLong}</p>
                </div>
              </div>
              <div className={styles.line}></div>
              <div>
                <p className={styles.subTitle}>Inferred Synopsis (Arabic):</p>
                <div className={styles.description}>
                  <p>{data.descriptionArabic}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>
                  Pure Image Description (Arabic):
                </p>
                <div className={styles.description}>
                  <p>{data.pureImageDescriptionArabic}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>
                  Short Marketing Message (Arabic):
                </p>
                <div className={styles.description}>
                  <p>{data.marketingMessageShortArabic}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>
                  Long Marketing Message (Arabic):
                </p>
                <div className={styles.description}>
                  <p>{data.marketingMessageLongArabic}</p>
                </div>
              </div>
              <div className={styles.line}></div>
              <div>
                <p className={styles.subTitle}>Inferred Synopsis (French):</p>
                <div className={styles.description}>
                  <p>{data.descriptionFrench}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>
                  Pure Image Description (French):
                </p>
                <div className={styles.description}>
                  <p>{data.pureImageDescriptionFrench}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>
                  Short Marketing Message (French):
                </p>
                <div className={styles.description}>
                  <p>{data.marketingMessageShortFrench}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>
                  Long Marketing Message (French):
                </p>
                <div className={styles.description}>
                  <p>{data.marketingMessageLongFrench}</p>
                </div>
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
