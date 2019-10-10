import {
  GET_PROJECTS,
  GET_SPANS,
  GET_TAGS,
  GET_USERS_PROJECT,
  GET_PROJECT,
  GET_SPAN_TYPES,
  GET_INSPECTIONS_PROJECT,
  GET_CATEGORIES_PROJECT,
  SET_CATEGORIES_EMPTY,
  GET_CATEGORIES_INSPECTION,
  GET_DEFICIENCIES,
  GET_MARKINGS_TYPES,
  GET_ACCESS_TYPES,
  GET_ACCESS_TYPE_DETAILS,
  SET_LATITUDE,
  SET_LONGITUDE,
  LOADED_CATEGORIES
} from "../actionTypes";

const initialState = {
  projects: [],
  project: null,
  spans: [],
  tags: [],
  users: [],
  spanTypes: [],
  inspections: [],
  categories_project: [
    {
      id: 28,
      name: 'Body',
      inspection_id: 4,
      items: [
        {
          id: 3277,
          name: 'Structural Steel',
          category_id: 28
        },
        {
          id: 3278,
          name: 'Nuts/Bolts',
          category_id: 28
        }
      ]
    },
    {
      id: 29,
      name: 'Arms',
      inspection_id: 4,
      items: [
        {
          id: 3279,
          name: 'Structural Steel',
          category_id: 29
        },
        {
          id: 3280,
          name: 'Nuts/Bolts',
          category_id: 29
        }
      ]
    },
    {
      id: 30,
      name: 'Conductor & Components',
      inspection_id: 4,
      items: [
        {
          id: 3281,
          name: 'Shackle',
          category_id: 30
        },
        {
          id: 3282,
          name: 'Extension Link',
          category_id: 30
        },
        {
          id: 3283,
          name: 'Y-Clevis',
          category_id: 30
        },
        {
          id: 3284,
          name: 'Yoke Plate',
          category_id: 30
        },
        {
          id: 3285,
          name: 'Line Guards',
          category_id: 30
        },
        {
          id: 3286,
          name: 'Suspension Clamp/Shoe',
          category_id: 30
        },
        {
          id: 3287,
          name: 'Conductor',
          category_id: 30
        },
        {
          id: 3288,
          name: 'Jumpers',
          category_id: 30
        },
        {
          id: 3289,
          name: 'Compression Splice',
          category_id: 30
        },
        {
          id: 3290,
          name: 'Terminal Pads',
          category_id: 30
        },
        {
          id: 3291,
          name: 'Conductor Spacers',
          category_id: 30
        },
        {
          id: 3292,
          name: 'Dampers',
          category_id: 30
        }
      ]
    },
    {
      id: 31,
      name: 'SW & Components',
      inspection_id: 4,
      items: [
        {
          id: 3293,
          name: 'Shackle',
          category_id: 31
        },
        {
          id: 3294,
          name: 'Extension Link',
          category_id: 31
        },
        {
          id: 3295,
          name: 'Strain Clamp',
          category_id: 31
        },
        {
          id: 3296,
          name: 'Suspension Clamp/Shoe',
          category_id: 31
        },
        {
          id: 3297,
          name: 'Armor Rod',
          category_id: 31
        },
        {
          id: 3298,
          name: 'Damper',
          category_id: 31
        },
        {
          id: 3299,
          name: 'Wire',
          category_id: 31
        }
      ]
    },
    {
      id: 32,
      name: 'OPGW & Components',
      inspection_id: 4,
      items: [
        {
          id: 3300,
          name: 'Shackle',
          category_id: 32
        },
        {
          id: 3301,
          name: 'Extension Link',
          category_id: 32
        },
        {
          id: 3302,
          name: 'Strain Clamp',
          category_id: 32
        },
        {
          id: 3303,
          name: 'Suspension Clamp/Shoe',
          category_id: 32
        },
        {
          id: 3304,
          name: 'Downlead Clamps',
          category_id: 32
        },
        {
          id: 3305,
          name: 'Splice Box',
          category_id: 32
        },
        {
          id: 3306,
          name: 'Splice Box Bracket',
          category_id: 32
        }
      ]
    },
    {
      id: 33,
      name: 'Insulators',
      inspection_id: 4,
      items: [
        {
          id: 3307,
          name: 'Insulators',
          category_id: 33
        },
        {
          id: 3308,
          name: 'Corona Ring',
          category_id: 33
        }
      ]
    },
    {
      id: 34,
      name: 'Foundation',
      inspection_id: 4,
      items: [
        {
          id: 3309,
          name: 'Brackets/Nuts/Bolts',
          category_id: 34
        },
        {
          id: 3310,
          name: 'Grounding',
          category_id: 34
        },
        {
          id: 3311,
          name: 'Nuts/bolts',
          category_id: 34
        },
        {
          id: 3312,
          name: 'Concrete',
          category_id: 34
        }
      ]
    },
    {
      id: 35,
      name: 'Structure Site',
      inspection_id: 4,
      items: [
        {
          id: 3313,
          name: 'Work Pad',
          category_id: 35
        }
      ]
    },
    {
      id: 36,
      name: 'Underbuild',
      inspection_id: 4,
      items: [
        {
          id: 3314,
          name: 'Insulator',
          category_id: 36
        },
        {
          id: 3315,
          name: 'Cable Attachment',
          category_id: 36
        },
        {
          id: 3316,
          name: 'Arm',
          category_id: 36
        },
        {
          id: 3317,
          name: 'Pole Attachment',
          category_id: 36
        }
      ]
    },
    {
      id: 19,
      name: 'sadsad',
      inspection_id: 3,
      items: [
        {
          id: 2850,
          name: 'Signage',
          category_id: 19
        },
        {
          id: 2851,
          name: 'Pole Top',
          category_id: 19
        },
        {
          id: 2852,
          name: 'X-Braces',
          category_id: 19
        },
        {
          id: 2853,
          name: 'X-Brace Center Clamp',
          category_id: 19
        },
        {
          id: 2854,
          name: 'X-Brace Nuts/Bolts',
          category_id: 19
        },
        {
          id: 2855,
          name: 'V-Braces',
          category_id: 19
        },
        {
          id: 2856,
          name: 'V Brace Nuts/Bolts',
          category_id: 19
        },
        {
          id: 2857,
          name: 'Grounding',
          category_id: 19
        },
        {
          id: 2858,
          name: 'Standoff Brackets',
          category_id: 19
        }
      ]
    },
    {
      id: 20,
      name: 'SW & Components',
      inspection_id: 3,
      items: [
        {
          id: 2859,
          name: 'SW Arm/Bracket',
          category_id: 20
        },
        {
          id: 2860,
          name: 'Bonding',
          category_id: 20
        },
        {
          id: 2861,
          name: 'Polebands',
          category_id: 20
        },
        {
          id: 2862,
          name: 'Shackle',
          category_id: 20
        },
        {
          id: 2863,
          name: 'Extension Link',
          category_id: 20
        },
        {
          id: 2864,
          name: 'Strain Clamp',
          category_id: 20
        },
        {
          id: 2865,
          name: 'Suspension Clamp/Shoe',
          category_id: 20
        },
        {
          id: 2866,
          name: 'Armor Rod',
          category_id: 20
        },
        {
          id: 2867,
          name: 'Damper',
          category_id: 20
        },
        {
          id: 2868,
          name: 'Wire',
          category_id: 20
        }
      ]
    },
    {
      id: 21,
      name: 'Conductor & Components',
      inspection_id: 3,
      items: [
        {
          id: 2869,
          name: 'Crossarm',
          category_id: 21
        },
        {
          id: 2870,
          name: 'Crossarm Brackets',
          category_id: 21
        },
        {
          id: 2871,
          name: 'Crossarm Bolts',
          category_id: 21
        },
        {
          id: 2872,
          name: 'Polebands',
          category_id: 21
        },
        {
          id: 2873,
          name: 'Bonding',
          category_id: 21
        },
        {
          id: 2874,
          name: 'Shackle',
          category_id: 21
        },
        {
          id: 2875,
          name: 'Extension Link',
          category_id: 21
        },
        {
          id: 2876,
          name: 'Y-Clevis',
          category_id: 21
        },
        {
          id: 2877,
          name: 'Yoke Plate',
          category_id: 21
        },
        {
          id: 2878,
          name: 'Line Guards',
          category_id: 21
        },
        {
          id: 2879,
          name: 'Suspension Clamp/Shoe',
          category_id: 21
        },
        {
          id: 2880,
          name: 'Conductor',
          category_id: 21
        },
        {
          id: 2881,
          name: 'Jumpers',
          category_id: 21
        },
        {
          id: 2882,
          name: 'Compression Splice',
          category_id: 21
        },
        {
          id: 2883,
          name: 'Terminal Pads',
          category_id: 21
        },
        {
          id: 2884,
          name: 'Conductor Spacers',
          category_id: 21
        },
        {
          id: 2885,
          name: 'Dampers',
          category_id: 21
        }
      ]
    },
    {
      id: 22,
      name: 'Insulators',
      inspection_id: 3,
      items: [
        {
          id: 2886,
          name: 'Brackets/Nuts/Bolts',
          category_id: 22
        },
        {
          id: 2887,
          name: 'Insulators',
          category_id: 22
        },
        {
          id: 2888,
          name: 'Corona Ring',
          category_id: 22
        }
      ]
    },
    {
      id: 23,
      name: 'OPGW & Components',
      inspection_id: 3,
      items: [
        {
          id: 2889,
          name: 'Polebands',
          category_id: 23
        },
        {
          id: 2890,
          name: 'Bonding',
          category_id: 23
        },
        {
          id: 2891,
          name: 'Shackle',
          category_id: 23
        },
        {
          id: 2892,
          name: 'Extension Link',
          category_id: 23
        },
        {
          id: 2893,
          name: 'Strain Clamp',
          category_id: 23
        },
        {
          id: 2894,
          name: 'Suspension Clamp/Shoe',
          category_id: 23
        },
        {
          id: 2895,
          name: 'Downlead Clamps',
          category_id: 23
        },
        {
          id: 2896,
          name: 'Splice Box',
          category_id: 23
        },
        {
          id: 2897,
          name: 'Splice Box Bracket',
          category_id: 23
        }
      ]
    },
    {
      id: 24,
      name: 'Guying Components',
      inspection_id: 3,
      items: [
        {
          id: 2898,
          name: 'Polebands',
          category_id: 24
        },
        {
          id: 2899,
          name: 'Bonding',
          category_id: 24
        },
        {
          id: 2900,
          name: 'Guy Grip',
          category_id: 24
        },
        {
          id: 2901,
          name: 'Guy Insulator',
          category_id: 24
        },
        {
          id: 2902,
          name: 'Guy Wire',
          category_id: 24
        }
      ]
    },
    {
      id: 25,
      name: 'Foundation',
      inspection_id: 3,
      items: [
        {
          id: 2903,
          name: 'Grounding',
          category_id: 25
        },
        {
          id: 2904,
          name: 'Nuts/bolts',
          category_id: 25
        },
        {
          id: 2905,
          name: 'Concrete',
          category_id: 25
        }
      ]
    },
    {
      id: 26,
      name: 'Structure Site',
      inspection_id: 3,
      items: [
        {
          id: 2906,
          name: 'Work Pad',
          category_id: 26
        }
      ]
    },
    {
      id: 27,
      name: 'Underbuild',
      inspection_id: 3,
      items: [
        {
          id: 2907,
          name: 'Insulator',
          category_id: 27
        },
        {
          id: 2908,
          name: 'Cable Attachment',
          category_id: 27
        },
        {
          id: 2909,
          name: 'Arm',
          category_id: 27
        },
        {
          id: 2910,
          name: 'Pole Attachment',
          category_id: 27
        }
      ]
    }
  ],
  categoriesInspection: [],
  deficiencies: [],
  marking_types: [],
  access_types: [],
  details: [],
  latitude: "",
  longitude: "",
  loadedCategories: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECT:
      return { ...state, project: action.payload };

    case GET_PROJECTS:
      return { ...state, projects: action.payload };

    case GET_SPANS:
      return { ...state, spans: action.payload };

    case GET_TAGS:
      return { ...state, tags: action.payload };

    case GET_USERS_PROJECT:
      return { ...state, users: action.payload };

    case GET_SPAN_TYPES:
      return { ...state, spanTypes: action.payload };

    case GET_INSPECTIONS_PROJECT:
      return { ...state, inspections: action.payload };

    case GET_CATEGORIES_PROJECT:
      const categories = state.categories_project.concat(action.payload);
      return { ...state, categories_project: categories };

    case SET_CATEGORIES_EMPTY:
      return { ...state, categories_project: [] };

    case GET_CATEGORIES_INSPECTION:
      return { ...state, categoriesInspection: action.payload };

    case GET_DEFICIENCIES:
      return { ...state, deficiencies: action.payload };
      
    case GET_MARKINGS_TYPES:
      return { ...state, marking_types: action.payload };

    case GET_ACCESS_TYPES:
      return { ...state, access_types: action.payload };
      
    case GET_ACCESS_TYPE_DETAILS:
      return { ...state, details: action.payload };

    case SET_LATITUDE:
      return { ...state, latitude: action.payload };
    case SET_LONGITUDE:
      return { ...state, longitude: action.payload };

    case LOADED_CATEGORIES:
      return { ...state, loadedCategories: action.payload };

    default:
      return state;
  }
};
