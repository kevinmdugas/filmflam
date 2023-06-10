import { RawStatement } from "../../types";

export function DefaultStatements() {
	const data: RawStatement[] = [
		{
			predicates: [
				"",
				" made me want to cut up a bunch of lime wedges and squeeze the juices onto my eyeballs. That's how bad it was.",
			],
			paramType: "main",
			ratingType: "terrible",
		},
		{
			predicates: [
				"My parents walked in on me watching ",
				" the other day and they immediately told me that I'm both grounded and that they would begin adoption proceedings immediately because they're so ashamed. I was like, 'Guys, I'm 49 and you're visiting me on Christmas. Settle down.'",
			],
			paramType: "main",
			ratingType: "terrible",
		},
		{
			predicates: [
				"I watched ",
				" the other day and it really made me appreciate The Titanic. Not the movie, you know the concept of drowning in a freezing ocean because that's what I wish I was doing instead of watching that trash.",
			],
			paramType: "main",
			ratingType: "terrible",
		},
		{
			predicates: [
				"I saw ",
				" the other day and I loved it! Which is not a good sign because I'm an absolute charlatan.",
			],
			paramType: "main",
			ratingType: "negative",
		},
		{
			predicates: ["", " was so so so so so bad. Now let's get back to huffing this glue."],
			paramType: "main",
			ratingType: "negative",
		},
		{
			predicates: [
				"I will literally give you all of the money in my wallet right now if you never ask me about ",
				" ever again. No, I don't have any money Gary but that's not the point.",
			],
			paramType: "main",
			ratingType: "negative",
		},
		{
			predicates: [
				"",
				" sure was a thing that was made! Gotta give it credit for that much at least.",
			],
			paramType: "main",
			ratingType: "average",
		},
		{
			predicates: [
				"I mean, ",
				" was fine I guess. But you ever get the sense that you can't feel anything anymore? Like sometimes I'm not sure if I'm even real, you know?",
			],
			paramType: "main",
			ratingType: "average",
		},
		{
			predicates: [
				"Yes, I saw ",
				" along with all fifteen of the other things you've asked me if I've seen. Is this all we have to talk about anymore?... Yes I'm fun at parties but I don't see what that has to do with anything.",
			],
			paramType: "main",
			ratingType: "average",
		},
		{
			predicates: [
				"Ahhh ",
				" was so good. I had a little... accident... while I was watching it but I didn't want to pause it so I just watched it on my phone while I was in the shower! I'm down a phone but honestly worth it.",
			],
			paramType: "main",
			ratingType: "positive",
		},
		{
			predicates: [
				"My neighbor heard through the wall that I was watching ",
				" and she yelled at me through the wall begging me to turn up the volume full blast so that she could hear it too. My ears are still ringing! What? What? What?",
			],
			paramType: "main",
			ratingType: "positive",
		},
		{
			predicates: [
				"Dude ",
				" totally got me out of a ticket the other day. I was speeding the other day with it playing on my car tv and the cop pulled me over. When he walked he up, he saw what I was watching and, needless to say, we spent the rest of the afternoon together holding hands and chomping down doughnuts.",
			],
			paramType: "main",
			ratingType: "positive",
		},
		{
			predicates: [
				"OHHHHHH MYYYY GOOOOOODDDDD INJEEEEECT ",
				" INTO MY VEEEEEEEINSSSSSSSSSS! *snorts a mysterious white powder* AHHH ASBESTOS, NOT AGAAAAIN!",
			],
			paramType: "main",
			ratingType: "exceptional",
		},
		{
			predicates: [
				"Alright it's been *checks watch* 46 hours straight of watching ",
				" and I haven't showered, I haven't left my house, I've had like four little cups of water (like the measurement, not the container). I have my kids over here banging on my bedroom door asking me when I'm gonna feed them and I'm just like 'I can't with you right now.'",
			],
			paramType: "main",
			ratingType: "exceptional",
		},
		{
			predicates: [
				"Alright that's it, I'm doing it. I'm getting a face tattoo. Now I know what you're thinking, 'Wow that's so badass, you're so badass.' And I agree but I have to give all the credit to ",
				" . The tattoo is gonna be on my forehead and it's gonna be a portrait of me watching it and the tattoo itself will be on my forehead in the tattoo, if you see what I mean. So it'll be like an infinity mirror where you continually see the portrait at decreasing sizes as you zoom in, which means the tattoo artist is gonna have to continue drawing it until the tattoo is on my quarks, man. That tattoo will be on my quarks.",
			],
			paramType: "main",
			ratingType: "exceptional",
		},
		{
			predicates: [
				" I'd have to revoke my ",
				" official fan club badge if they were in it and then like burn it and then like burn the ashes in a volcano and then jump in that volcano. I mean, that's reasonable, right?",
			],
			paramType: "favActor",
			ratingType: "terrible",
		},
		{
			predicates: [
				" I had to cleanse the pallet, as it were, afterwards by playing ",
				" on a loop, rocking back and forth and shouting 'BILLY DOESN'T LIKE THAT' over and over until they sent the authorities to collect me with a big butterfly net.",
			],
			paramType: "favFilm",
			ratingType: "terrible",
		},
		{
			predicates: ["terrible tv show pred", ""],
			paramType: "favTVShow",
			ratingType: "terrible",
		},
		{
			predicates: ["negative actor pred", ""],
			paramType: "favActor",
			ratingType: "negative",
		},
		{
			predicates: ["negative movie pred", ""],
			paramType: "favFilm",
			ratingType: "negative",
		},
		{
			predicates: ["negative tv show pred", ""],
			paramType: "favTVShow",
			ratingType: "negative",
		},
		{
			predicates: ["average actor pred", ""],
			paramType: "favActor",
			ratingType: "average",
		},
		{
			predicates: ["average movie", ""],
			paramType: "favFilm",
			ratingType: "average",
		},
		{
			predicates: ["average tv show", ""],
			paramType: "favTVShow",
			ratingType: "average",
		},
		{
			predicates: ["positive actor", ""],
			paramType: "favActor",
			ratingType: "positive",
		},
		{
			predicates: ["positive movie", ""],
			paramType: "favFilm",
			ratingType: "positive",
		},
		{
			predicates: ["positive tv show", ""],
			paramType: "favTVShow",
			ratingType: "positive",
		},
		{
			predicates: ["exceptional actor", ""],
			paramType: "favActor",
			ratingType: "exceptional",
		},
		{
			predicates: ["exceptional movie", ""],
			paramType: "favFilm",
			ratingType: "exceptional",
		},
		{
			predicates: ["exceptional tv show", ""],
			paramType: "favTVShow",
			ratingType: "exceptional",
		},
	];
	return data;
}
