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
- Genre e.g. 'action', 'comedy', 'drama', 'thriller'
- Theme e.g. 'superhero', 'romance', 'crime', 'fantasy'
- Era e.g. '80s', '90s', 'modern'
- Audience e.g. 'family', 'adult', 'teen'
- Notable features e.g. 'animated', 'musical', 'biographical'
- Description of Actions e.g. 'explosions', 'rain', 'wild-fires'

Only deduce genre, theme, era, audience, or notable features when it is obvious that they make the movie or TV show depicted in the image stand out.

Return keywords in the format of an array of strings, like this:
['action', 'superhero', 'modern']
    
`;
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
    console.log();
    // console.log(await response.json());
    res.status(200).json({ tags: tags });
  }
}
