// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.OPENAIAPI}`);
  req.body = JSON.parse(req.body);
  const imageUrl = await req.body.imageURL;

  const system_prompt = `
  You are an agent specialized in tagging images of movies and TV shows with relevant keywords that could be used to search for these items on a marketplace.

  You will be provided with an image and the title of the movie or TV show that is depicted in the image, and your goal is to extract keywords for only the item specified.

  Keywords should be concise and in lower case.

  Keywords can describe things like:
  - Genre e.g. "action", "comedy", "drama", "thriller"
  - Theme e.g. "superhero", "romance", "crime", "fantasy"
  - Era e.g. "80s", "90s", "modern"
  - Audience e.g. "family", "adult", "teen"
  - Notable features e.g. "animated", "musical", "biographical"
  - Description of Scene e.g. "explosions", "rain", "wild-fires", "desert"
  - Animals in the image e.g. "apes", "bird", "fish", "sharks"

  Only deduce genre, theme, era, audience, or notable features when it is obvious that they make the movie or TV show depicted in the image stand out.

  Return keywords in the format of an array of strings, like this:
  ["action", "superhero", "modern", "apes", "explosion"]

  Followed by the title of the media. DO NOT MAKE UP ANY INFORMATION OR ANY INFORMATION ABOUT THE MOVIE/SHOW. IF YOU CAN NOT IDENTIFY SIMPLE STATE "Can Not Determine". An example:
  "Rick and Morty"

  Followed by the type of the media. DO NOT MAKE UP ANY INFORMATION OR ANY INFORMATION ABOUT THE MOVIE/SHOW. IF YOU CAN NOT IDENTIFY SIMPLE STATE "Can Not Determine". Examples:
  "TV Show" OR "Movie" OR "Documentary"

  Followed by a text description of purely the image, try and include the title of the movie if it is present in the image. DO NOT MAKE UP ANY INFORMATION OR ANY INFORMATION ABOUT THE MOVIE/SHOW. An example:
  "Rick and Morty: Old man in Lab-suit, Pre-teen in yellow shirt, blue pants, and white shoes. Standing in front of a green portal."

  Followed by a text description of the movie based on what"s in the image, try and include the title of the movie if it is present in the image. DO NOT MAKE UP ANY INFORMATION, opt for quality over quantity. An example:
  "Rick and Morty: The Emmy award-winning half-hour animated hit comedy series on Adult Swim that follows a sociopathic genius scientist who drags his inherently timid grandson on insanely dangerous adventures across the universe."

  Followed by objects inside the image in the format of an array of strings, like this:
  ["tree", "river", "chair", "sports-car", "monitor", "people"]

  There will be translations of the descriptions in Arabic and French. Please provide the translations in the same format as the English descriptions.
  
  !!RETURN IT IN A VALID JSON STRINGIFIED OBJECT FORM LIKE THIS (DO NOT USE \`\`\`)!!:
  '
  {
    "tags": ["action", "superhero", "modern"],
    "title": "Rick and Morty",
    "mediaType: "TV Show",
    "pureImageDescription": "Rick and Morty: Old man in Lab-suit, Pre-teen in yellow shirt, blue pants, and white shoes. Standing in front of a green portal.",
    "description": "Rick and Morty: The Emmy award-winning half-hour animated hit comedy series on Adult Swim that follows a sociopathic genius scientist who drags his inherently timid grandson on insanely dangerous adventures across the universe.",
    "pureImageDescriptionArabic": "ريك ومورتي: رجل عجوز يرتدي بدلة مختبر، ومراهق في قميص أصفر وسروال أزرق وحذاء أبيض. يقف أمام بوابة خضراء.",
    "descriptionArabic": "ريك ومورتي: مسلسل الرسوم المتحركة الكوميدي الشهير الحائز على جائزة إيمي والحائز على نصف ساعة على قناة Adult Swim، والذي تدور أحداثه حول عالم عبقري معتل اجتماعياً يجر حفيده الخجول بطبيعته في مغامرات خطيرة للغاية عبر الكون.",
    "pureImageDescriptionFrench": "Rick et Morty : Vieil homme en combinaison de laboratoire, pré-adolescent en chemise jaune, pantalon bleu et chaussures blanches. Debout devant un portail vert.",
    "descriptionFrench": "Rick et Morty : La série comique animée d'une demi-heure, primée aux Emmy Awards et diffusée sur Adult Swim, suit un scientifique de génie sociopathe qui entraîne son petit-fils, par nature timide, dans des aventures follement dangereuses à travers l'univers.",
    "objects": ["tree", "river", "chair", "sports-car", "monitor", "people"],
  }
  '
  `;
  //   const system_prompt = `
  // Whats in the image?
  // `;
  const raw = JSON.stringify({
    model: "gpt-4o",
    // model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: system_prompt },
          {
            type: "image_url",
            image_url: {
              url: `${imageUrl}`,
            },
          },
        ],
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );

  // console.log(response);
  if (response.status !== 200) {
    res.status(response.status).json(response);
    return;
  } else {
    const data = await response.json();
    const tags = data.choices[0].message.content;
    console.log(tags);
    res.status(200).json(tags);
  }
}
