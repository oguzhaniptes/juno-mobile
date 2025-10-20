import { FeedItem } from "./components/Home/FeedCarousel";

interface Team {
  name: string;
  logo: string;
}

export interface Match {
  sport: "football" | "basketball" | "tennis";
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: string;
}

export const liveMatches: Match[] = [
  {
    sport: "football",
    homeTeam: { name: "Chelsea", logo: "/images/chelsea_logo.png" },
    awayTeam: { name: "Arsenal", logo: "/images/arsenal_logo.png" },
    homeScore: 2,
    awayScore: 1,
    status: "Halftime",
  },
  {
    sport: "football",
    homeTeam: { name: "Chelsea", logo: "/images/chelsea_logo.png" },
    awayTeam: { name: "Arsenal", logo: "/images/arsenal_logo.png" },
    homeScore: 2,
    awayScore: 1,
    status: "Halftime",
  },
  {
    sport: "football",
    homeTeam: { name: "Chelsea", logo: "/images/chelsea_logo.png" },
    awayTeam: { name: "Arsenal", logo: "/images/arsenal_logo.png" },
    homeScore: 2,
    awayScore: 1,
    status: "Halftime",
  },
  {
    sport: "basketball",
    homeTeam: { name: "Lakers", logo: "/images/lakers_logo.png" },
    awayTeam: { name: "Celtics", logo: "/images/celtics_logo.png" },
    homeScore: 88,
    awayScore: 92,
    status: "Q3 - 05:30",
  },
  {
    sport: "tennis",
    homeTeam: { name: "Djokovic", logo: "/images/djokovic_logo.png" },
    awayTeam: { name: "Alcaraz", logo: "/images/alcaraz_logo.png" },
    homeScore: 1,
    awayScore: 2,
    status: "Set 4 - 3:4",
  },
];

export const feedItems = [
  {
    id: 1,
    type: "news",
    category: "Football",
    title: "Real Madrid wins Champions League final",
    content: "Madrid defeated Liverpool 1-0 in Paris to claim their 14th title.",
    imageUrl: "/images/real_madrid_champions.png",
    likes: 1200,
    comments: 500,
    shares: 300,
  },
  {
    id: 2,
    type: "user-post",
    authorName: "SportsFanatic",
    category: "Sports",
    content: "Game Day Vibes! Excited for the big game tonight! Who else is ready to cheer on their team? #GameNight #SportsFan",
    imageUrl: "",
    likes: 23,
    comments: 5,
    shares: 12,
  },
  {
    id: 3,
    type: "ad",
    title: "Premium Sports Gear",
    description: "Get the latest and greatest sports equipment at unbeatable prices!",
    imageUrl: "/images/ad_banner_1.png",
    ctaText: "Shop Now",
    ctaLink: "/shop",
  },
  {
    id: 4,
    type: "news",
    category: "Basketball",
    title: "Warriors secure NBA Championship",
    content: "Golden State Warriors beat Boston Celtics in a thrilling series.",
    imageUrl: "/images/warriors_champions.png",
    likes: 950,
    comments: 320,
    shares: 180,
  },
  {
    id: 5,
    type: "user-post",
    authorName: "Baller_23",
    category: "Basketball",
    content: "What a game last night! My team played lights out! #NBA #Basketball",
    imageUrl: "/images/basketball_post.png",
    likes: 55,
    comments: 15,
    shares: 8,
  },
  {
    id: 6,
    type: "ad",
    title: "Fantasy League Sign-ups Open!",
    description: "Create your dream team and compete for amazing prizes. Join now!",
    imageUrl: "/images/ad_fantasy.png",
    ctaText: "Sign Up",
    ctaLink: "/fantasy-league",
  },
] as FeedItem[];

interface Community {
  id: number;
  name: string;
  members: number;
  description: string;
  cover: string; // URI
}

export const userCommunities: Community[] = [
  { id: 1, name: "Madridistas", members: 12840, description: "Real Madrid fans worldwide.", cover: "https://via.placeholder.com/100/f60/fff?text=RM" },
  { id: 2, name: "NBA Talk", members: 53210, description: "Daily hoops banter and insights.", cover: "https://via.placeholder.com/100/000/fff?text=NBA" },
  { id: 7, name: "Arsenal Gooners", members: 21450, description: "North London is red. Matches, memes, transfers.", cover: "https://via.placeholder.com/100/FF0000/fff?text=ARS" },
  { id: 8, name: "Lakers Nation", members: 60231, description: "LA hoops. Game threads, highlights, history.", cover: "https://via.placeholder.com/100/551A8B/fff?text=LAL" },
  { id: 9, name: "Tennis Talk", members: 17420, description: "ATP/WTA debates, tour news, and rankings.", cover: "https://via.placeholder.com/100/008000/fff?text=TEN" },
  { id: 10, name: "Premier Banter", members: 31290, description: "EPL chatter, weekly matchday threads.", cover: "https://via.placeholder.com/100/0000FF/fff?text=EPL" },
  { id: 11, name: "EuroBall", members: 12980, description: "UEFA nights, transfers, and rumors.", cover: "https://via.placeholder.com/100/FFD700/000?text=UEFA" },
];

export const activeMatchCommunities: Community[] = [
  { id: 3, name: "Premier League Live", members: 40211, description: "Live chat for today's fixtures.", cover: "https://via.placeholder.com/100/FF69B4/fff?text=LIVE" },
  { id: 4, name: "US Open Watch", members: 9870, description: "Set-by-set tennis reactions.", cover: "https://via.placeholder.com/100/800080/fff?text=USO" },
];

export const suggestedCommunities: Community[] = [
  { id: 5, name: "Tactics & Analysis", members: 22145, description: "Deep dives into strategy and plays.", cover: "https://via.placeholder.com/100/00FFFF/000?text=TAC" },
  { id: 6, name: "FPL Pros", members: 15190, description: "Fantasy tips, lineups and waivers.", cover: "https://via.placeholder.com/100/008080/fff?text=FPL" },
];
