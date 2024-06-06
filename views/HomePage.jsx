import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import CloudinaryUploadWidget from "@/components/ImageUploader/CloudinaryUploadWidget";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
export default function HomePage() {
  const [imageURL, setImageURL] = useState("");
  useEffect(() => {
    document.addEventListener("click", (e) => {
      // console.log(e);
      if (e.target.className == styles.tag) {
        // console.log(e.target.innerText);
        navigator.clipboard.writeText(e.target.innerText);
      }
    });
  }, []);
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
    // console.log(await res.json())
    try {
      var dataRes = await res.json();
      dataRes = JSON.parse(dataRes);
    } catch (e) {
      console.error("Failed to parse JSON response");
      console.error(e);
    }
    console.log(dataRes);

    if (res.status == 200) {
      if (
        dataRes.title &&
        dataRes.tags &&
        dataRes.mediaType &&
        dataRes.objects &&
        dataRes.sensitiveTags &&
        dataRes.saudiAgeRating &&
        dataRes.similarMedia &&
        dataRes.modestyRating &&
        dataRes.pureImageDescription &&
        dataRes.description &&
        dataRes.marketingMessageShort &&
        dataRes.marketingMessageLong &&
        dataRes.descriptionArabic &&
        dataRes.pureImageDescriptionArabic &&
        dataRes.marketingMessageShortArabic &&
        dataRes.marketingMessageLongArabic &&
        dataRes.descriptionFrench &&
        dataRes.pureImageDescriptionFrench &&
        dataRes.marketingMessageShortFrench &&
        dataRes.marketingMessageLongFrench
      ) {
        setData(dataRes);
        setDataStore(dataRes);
        console.log(dataRes);
        setButtonText("Re-tag");
        return;
      } else {
        setButtonText("Failed, retrying...");
        tagImage();
      }
      return;
    } else {
      console.error("Failed to tag image");
      console.error("Status Code: ", res.status);
      //   setSummarizedText(`Failed to summarize text. Status Code: ${res.status}`);
      setData({
        tags: ["Failed to generate tags"],
        title: "Failed to generate title",
        mediaType: "Failed to identify media type",
        objects: ["Failed to identify objects"],
        sensitiveTags: ["Failed to identify sensitive items"],
        saudiAgeRating: "Failed to generate age rating",
        similarMedia: ["Failed to generate similar media"],
        modestyRating: ["Failed to generate modesty rating"],
        pureImageDescription: "Failed to generate image description",
        pureImageDescriptionArabic: "Failed to generate image description",
        pureImageDescriptionFrench: "Failed to generate image description",
        description: "Failed to generate plot synopsis",
        descriptionArabic: "Failed to generate plot synopsis",
        descriptionFrench: "Failed to generate plot synopsis",
        marketingMessageShort: "Failed to generate marketing message",
        marketingMessageShortArabic: "Failed to generate marketing message",
        marketingMessageShortFrench: "Failed to generate marketing message",
        marketingMessageLong: "Failed to generate marketing message",
        marketingMessageLongArabic: "Failed to generate marketing message",
        marketingMessageLongFrench: "Failed to generate marketing message",
      });
      setButtonText(`Failed (${res.status})`);
      setTimeout(() => {
        setButtonText("Tag");
      }, 2000);
    }
  }, 300);

  return (
    <div className={styles.homePage}>
      <p className={styles.title}>OSN Image Tagger</p>
      <div className={styles.mainLayout}>
        <div className={styles.imageCont}>
          {imageURL ? (
            <>
              <Image
                width={500}
                height={750}
                className={styles.image}
                src={`https://wsrv.nl/?url=${imageURL}`}
              ></Image>
              <p
                onClick={() => {
                  setImageURL("");
                  setButtonText("Tag");
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
        <div
          className={`${styles.aiData} ${!data ? styles.aiDataCollapsed : ""}`}
        >
          {data ? (
            <div>
              <div>
                <p className={styles.subTitle}>Title:</p>
                <div className={styles.tags}>
                  <p className={styles.tag}>{data.title}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>Media Type:</p>
                <div className={styles.tags}>
                  <p className={styles.tag}>{data.mediaType}</p>
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
                <p className={styles.subTitle}>
                  Saudi Age Rating for the Media:
                </p>
                <div className={styles.tags}>
                  <p className={styles.tag}>{data.saudiAgeRating}</p>
                </div>
              </div>
              <div>
                <p className={styles.subTitle}>Gulf Modesty Rating:</p>
                <div className={styles.tags}>
                  {data.modestyRating.map((object) => {
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
