import NadidInk from '../stories/nadid.ink.json'
import DavidInk from '../stories/test2.ink.json'

// TODO: Update with other properties such as character image, character bio, chapter summary, etc
export const STORY_MAP = [
  {
    id: 1,
    name: 'Nadia',
    chapters: [
      {
        id: 1,
        name: 'Family Matters',
        inkJson: NadidInk,
        endings: [
          {
            id: 1,
            name: "Nadid's Happy Ending",
          },
          {
            id: 2,
            name: "Nadid's Sad Ending",
          },
          {
            id: 3,
            name: "Nadid's Neutral & Gavin's Happy Ending",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Dave Alonso',
    chapters: [
      {
        id: 1,
        name: 'The Bully',
        inkJson: DavidInk,
        endings: [
          {
            id: 1,
            name: "David's Happy Ending",
          },
          {
            id: 2,
            name: "David's Sad Ending",
          },
          {
            id: 3,
            name: "David's Neutral & Jason's Happy Ending",
          },
        ],
      },
    ],
  },
]
