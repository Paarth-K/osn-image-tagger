// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const myHeaders = new Headers();
  // res.status(205).json({ message: "Hello World" });
  // return;
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


  Followed by objects inside the image in the format of an array of strings, like this:
  ["tree", "river", "chair", "sports-car", "monitor", "people"]

  Followed by sensitive tags if present in the image (or the media), if not simply state ["none"], like this:
  ["18+", "blood", "political", "gore", "horror", "sex", "violence", "weapons", "alcohol", "drugs", "tobacco", "gambling", "profanity", "hate-speech"]

  Followed by the Saudi CST Age ratings for the Media (based on what you believe is most appropriate for the media), reference below:
  G: Film is suitable for a general audience of all ages.
	
	PG: Parental guidance is advised for film audience below 12 years old.
	
	PG12: Film audience below 12 years old must be accompanied by an adult.
	
	PG15: Film audience below 15 years old must be accompanied by an adult.
	
	R15: Film audience below 15 years old are prohibited to be admitted.
	
	R18: Film audience below 18 years old are prohibited to be admitted.

  Followed by similar media titles to the one identified based on the mood, synopsis and genre, like this:
  ["Inside Job", "Solar Opposites", "Bojack Horseman", "Gravity Falls"]

  Followed by a modesty / cultural rating for the media, like this:
  ["head covered", "hair visible", "arms covered", "legs covered", "modest clothing", "non compliant clothing"]

  Followed by the title of the media. DO NOT MAKE UP ANY INFORMATION OR ANY INFORMATION ABOUT THE MOVIE/SHOW. IF YOU CAN NOT IDENTIFY SIMPLE STATE "Can Not Determine". An example:
  "Rick and Morty"

  Followed by the type of the media. DO NOT MAKE UP ANY INFORMATION OR ANY INFORMATION ABOUT THE MOVIE/SHOW. IF YOU CAN NOT IDENTIFY SIMPLE STATE "Can Not Determine". Examples:
  "TV Show" OR "Movie" OR "Documentary"

  Followed by a text description of purely the image, try and include the title of the media if it is present in the image. DO NOT MAKE UP ANY INFORMATION OR ANY INFORMATION ABOUT THE MOVIE/SHOW. An example:
  "Rick and Morty: Old man in Lab-suit, Pre-teen in yellow shirt, blue pants, and white shoes. Standing in front of a green portal."

  Followed by an engaging synopsis of the media based on what"s in the image, DO NOT include the title of the media, and instead describe the contents of the show/movie. DO NOT MAKE UP ANY INFORMATION AND DO NOT INCLUDE ANY SPOILERS, opt for quality over quantity. An example:
  "Rick, an eccentric and alcoholic scientist, drags his teenage grandson, Morty, on wild adventures through alternate dimensions. They encounter bizarre creatures, cosmic politics, and deep questions about existence. Meanwhile, Morty tries to juggle all this with his regular life."

  Followed by a short marketing message that can be posted on social media that advertises the media in a very engaging and exciting way that is based on the mood of the picture (note make references to the streaming platform called 'OSN TV'), like this:
  "Sci-fi geek? Comedy lover? Then you'll love Rick and Morty! You can watch the Emmy award-winning half-hour animated hit comedy series by Adult Swim today on OSN TV, and get ready for a wild ride with Rick and Morty!"

  Followed by a slightly longer marketing message that can be posted on social media that advertises the media in a very engaging and exciting way that is based on the mood of the picture (note all references to streaming platforms should be 'OSN TV'), it could be like this:
  "Are you a fan of sci-fi and comedy? Then you'll love Rick and Morty! You can watch the Emmy award-winning half-hour animated hit comedy series by Adult Swim today on OSN TV that follows a sociopathic genius scientist who drags his inherently timid grandson on insanely dangerous adventures across the universe. Get ready for a wild ride with Rick and Morty!"

  There will be translations of the descriptions in Arabic and French. Please provide the translations in the same format as the English descriptions.
  
  RETURN A VALID JSON STRINGIFIED OBJECT ONLY. DO NOT USE \`\`\` AND ENSURE YOU RETURN EVERY SINGLE KEY IN THE OBJECT!!:
  {
    "tags": ["action", "superhero", "modern"],
    "title": "Rick and Morty",
    "mediaType": "TV Show",
    "objects": ["tree", "river", "chair", "sports-car", "monitor", "people"],
    "sensitiveTags": ["18+", "blood", "political", "gore", "horror", "sex", "violence", "weapons", "alcohol", "drugs", "tobacco", "gambling", "profanity", "hate-speech", "death"],
    "saudiAgeRating": "PG15",
    "similarMedia": ["Inside Job", "Solar Opposites", "Bojack Horseman", "Gravity Falls"],
    "modestyRating": ["hair visible", "arms covered", "legs covered", "modest clothing"],
    "pureImageDescription": "Rick and Morty: Old man in Lab-suit, Pre-teen in yellow shirt, blue pants, and white shoes. Standing in front of a green portal.",
    "pureImageDescriptionArabic": "ريك ومورتي: رجل عجوز يرتدي بدلة مختبر، ومراهق في قميص أصفر وسروال أزرق وحذاء أبيض. يقف أمام بوابة خضراء.",
    "pureImageDescriptionFrench": "Rick et Morty : Vieil homme en combinaison de laboratoire, pré-adolescent en chemise jaune, pantalon bleu et chaussures blanches. Debout devant un portail vert.",
    "description": "Rick, an eccentric and alcoholic scientist, drags his teenage grandson, Morty, on wild adventures through alternate dimensions. They encounter bizarre creatures, cosmic politics, and deep questions about existence. Meanwhile, Morty tries to juggle all this with his regular life.",
    "descriptionArabic": "يصطحب ريك، وهو عالم غريب الأطوار ومدمن على الكحول، حفيده المراهق مورتي في مغامرات جامحة عبر أبعاد بديلة. يواجهان مخلوقات غريبة، وسياسات كونية، وأسئلة عميقة حول الوجود. في هذه الأثناء، يحاول مورتي التوفيق بين كل ذلك وبين حياته العادية.",
    "descriptionFrench": "Rick, un scientifique excentrique et alcoolique, entraîne son petit-fils adolescent, Morty, dans de folles aventures à travers des dimensions alternatives. Ils rencontrent des créatures bizarres, des politiques cosmiques et des questions profondes sur l'existence. Pendant ce temps, Morty essaie de jongler entre tout cela et sa vie normale.",
    "marketingMessageShort": "Sci-fi geek? Comedy lover? Then you'll love Rick and Morty! You can watch the Emmy award-winning half-hour animated hit comedy series by Adult Swim today on OSN TV, and get ready for a wild ride with Rick and Morty!",
    "marketingMessageShortArabic": "مهووس بالخيال العلمي؟ محب للكوميديا؟ إذن ستحب ريك ومورتي! يمكنكم مشاهدة المسلسل الكوميدي الكرتوني الكرتوني الكوميدي الحائز على جائزة إيمي والحائز على نصف ساعة من Adult Swim الحائز على جائزة إيمي على OSN TV، واستعدوا لرحلة جامحة مع ريك ومورتي!",
    "marketingMessageShortFrench": "Fan de science-fiction ? Amateur de comédie ? Alors vous allez adorer Rick et Morty ! Vous pouvez regarder la série comique animée d'une demi-heure d'Adult Swim, récompensée par un Emmy Award, dès aujourd'hui sur OSN TV, et vous préparer à un voyage endiablé avec Rick et Morty !",
    "marketingMessageLong": "Are you a fan of sci-fi and comedy? Then you'll love Rick and Morty! You can watch the Emmy award-winning half-hour animated hit comedy series by Adult Swim today on OSN TV that follows a sociopathic genius scientist who drags his inherently timid grandson on insanely dangerous adventures across the universe. Get ready for a wild ride with Rick and Morty!",
    "marketingMessageLongArabic": "هل أنت من محبي الخيال العلمي والكوميديا؟ إذن ستحب ريك ومورتي! يمكنك اليوم مشاهدة المسلسل الكوميدي الكرتوني الكرتوني الشهير الحائز على جائزة إيمي والحائز على نصف ساعة من Adult Swim على OSN TV، والذي يتتبع عالم عبقري معتل اجتماعياً يجر حفيده الخجول بطبيعته في مغامرات خطيرة للغاية عبر الكون. استعد لرحلة جامحة مع ريك ومورتي!",
    "marketingMessageLongFrench": "Vous êtes fan de science-fiction et de comédie ? Alors vous allez adorer Rick et Morty ! Vous pouvez regarder dès aujourd'hui sur OSN TV la série comique animée d'une demi-heure d'Adult Swim, récompensée par un Emmy Award, qui suit un scientifique de génie sociopathe qui entraîne son petit-fils foncièrement timide dans des aventures follement dangereuses à travers l'univers. Préparez-vous à vivre une aventure folle avec Rick et Morty !",
  }
  `;
  //   const system_prompt = `
  // Whats in the image?
  // `;
  const raw = JSON.stringify({
    model: "gpt-4o",
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
    console.log(data.choices[0].message);
    res.status(200).json(tags);
  }
}
