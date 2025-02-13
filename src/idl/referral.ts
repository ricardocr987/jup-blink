import { IdlMetadata } from "@coral-xyz/anchor/dist/cjs/idl";

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/referral.json`.
 */
export type ReferralIdl = {
    version: "0.1.0";
    name: "referral";
    address: string;
    metadata: IdlMetadata;
    instructions: [
      {
        name: "initializeProject";
        discriminator: [
          69,
          126,
          215,
          37,
          20,
          60,
          73,
          235
        ];
        accounts: [
          {
            name: "payer",
            writable: true,
            signer: true
          },
          {
            name: "base",
            signer: true
          },
          {
            name: "admin"
          },
          {
            name: "project",
            writable: true
          },
          {
            name: "systemProgram"
          }
        ];
        args: [
          {
            name: "params";
            type: {
              defined: {
                name: "initializeProjectParams"
              }
            }
          }
        ]
      },
      {
        name: "initializeReferralAccount";
        discriminator: [
          92,
          25,
          0,
          243,
          230,
          205,
          254,
          67
        ];
        accounts: [
          {
            name: "payer",
            writable: true,
            signer: true
          },
          {
            name: "partner"
          },
          {
            name: "project"
          },
          {
            name: "referralAccount",
            writable: true,
            signer: true
          },
          {
            name: "systemProgram"
          }
        ];
        args: [
          {
            name: "params";
            type: {
              defined: {
                name: "initializeReferralAccountParams"
              }
            }
          }
        ]
      },
      {
        name: "initializeReferralAccountWithName";
        discriminator: [
          241,
          190,
          107,
          26,
          244,
          236,
          119,
          229
        ];
        accounts: [
          {
            name: "payer",
            writable: true,
            signer: true
          },
          {
            name: "partner"
          },
          {
            name: "project"
          },
          {
            name: "referralAccount",
            writable: true
          },
          {
            name: "systemProgram"
          }
        ];
        args: [
          {
            name: "params";
            type: {
              defined: {
                name: "initializeReferralAccountWithNameParams"
              }
            }
          }
        ]
      },
      {
        name: "updateProject";
        discriminator: [
          2,
          196,
          131,
          92,
          28,
          139,
          179,
          94
        ];
        accounts: [
          {
            name: "admin",
            signer: true
          },
          {
            name: "project",
            writable: true
          }
        ];
        args: [
          {
            name: "params";
            type: {
              defined: {
                name: "updateProjectParams"
              }
            }
          }
        ]
      },
      {
        name: "transferProject";
        discriminator: [
          164,
          123,
          142,
          233,
          67,
          142,
          71,
          148
        ];
        accounts: [
          {
            name: "admin",
            signer: true
          },
          {
            name: "newAdmin"
          },
          {
            name: "project",
            writable: true
          }
        ];
        args: [
          {
            name: "params";
            type: {
              defined: {
                name: "transferProjectParams"
              }
            }
          }
        ]
      },
      {
        name: "updateReferralAccount";
        discriminator: [
          216,
          83,
          99,
          19,
          220,
          191,
          74,
          197
        ];
        accounts: [
          {
            name: "admin",
            signer: true
          },
          {
            name: "project"
          },
          {
            name: "referralAccount",
            writable: true
          }
        ];
        args: [
          {
            name: "params";
            type: {
              defined: {
                name: "updateReferralAccountParams"
              }
            }
          }
        ]
      },
      {
        name: "transferReferralAccount";
        discriminator: [
          104,
          155,
          145,
          137,
          164,
          252,
          252,
          206
        ];
        accounts: [
          {
            name: "partner",
            signer: true
          },
          {
            name: "newPartner"
          },
          {
            name: "referralAccount",
            writable: true
          }
        ];
        args: [
          {
            name: "params";
            type: {
              defined: {
                name: "transferReferralAccountParams"
              }
            }
          }
        ]
      },
      {
        name: "initializeReferralTokenAccount";
        discriminator: [
          125,
          18,
          70,
          95,
          86,
          179,
          221,
          190
        ];
        accounts: [
          {
            name: "payer",
            writable: true,
            signer: true
          },
          {
            name: "project"
          },
          {
            name: "referralAccount"
          },
          {
            name: "referralTokenAccount",
            writable: true
          },
          {
            name: "mint"
          },
          {
            name: "systemProgram"
          },
          {
            name: "tokenProgram"
          },
          {
            name: "rent"
          }
        ];
        args: []
      },
      {
        name: "claim";
        discriminator: [
          62,
          198,
          214,
          193,
          213,
          159,
          108,
          210
        ];
        accounts: [
          {
            name: "payer",
            writable: true,
            signer: true
          },
          {
            name: "project"
          },
          {
            name: "admin"
          },
          {
            name: "projectAdminTokenAccount",
            writable: true
          },
          {
            name: "referralAccount"
          },
          {
            name: "referralTokenAccount",
            writable: true
          },
          {
            name: "partner"
          },
          {
            name: "partnerTokenAccount",
            writable: true
          },
          {
            name: "mint"
          },
          {
            name: "associatedTokenProgram"
          },
          {
            name: "systemProgram"
          },
          {
            name: "tokenProgram"
          }
        ];
        args: []
      }
    ];
    accounts: [
      {
        name: "project";
        discriminator: [
          205,
          168,
          189,
          202,
          181,
          247,
          142,
          19
        ]
      },
      {
        name: "referralAccount";
        discriminator: [
          237,
          162,
          80,
          78,
          196,
          233,
          91,
          2
        ]
      }
    ];
    events: [
      {
        name: "initializeProjectEvent";
        discriminator: [
          21,
          246,
          143,
          111,
          211,
          184,
          130,
          71
        ]
      },
      {
        name: "updateProjectEvent";
        discriminator: [
          125,
          97,
          249,
          244,
          44,
          120,
          92,
          19
        ]
      },
      {
        name: "initializeReferralAccountEvent";
        discriminator: [
          170,
          20,
          209,
          91,
          5,
          88,
          44,
          157
        ]
      },
      {
        name: "updateReferralAccountEvent";
        discriminator: [
          190,
          248,
          57,
          59,
          79,
          136,
          239,
          20
        ]
      },
      {
        name: "initializeReferralTokenAccountEvent";
        discriminator: [
          176,
          195,
          113,
          1,
          86,
          71,
          142,
          35
        ]
      },
      {
        name: "claimEvent";
        discriminator: [
          93,
          15,
          70,
          170,
          48,
          140,
          212,
          219
        ]
      }
    ];
    errors: [
      {
        code: 6000;
        name: "invalidCalculation"
      },
      {
        code: 6001;
        name: "invalidSharePercentage"
      },
      {
        code: 6002;
        name: "nameTooLong"
      }
    ];
    types: [
      {
        name: "initializeProjectParams";
        type: {
          kind: "struct";
          fields: [
            {
              name: "name";
              type: "string"
            },
            {
              name: "defaultShareBps";
              type: "u16"
            }
          ]
        }
      },
      {
        name: "initializeReferralAccountWithNameParams";
        type: {
          kind: "struct";
          fields: [
            {
              name: "name";
              type: "string"
            }
          ]
        }
      },
      {
        name: "initializeReferralAccountParams";
        type: {
          kind: "struct"
        }
      },
      {
        name: "transferProjectParams";
        type: {
          kind: "struct"
        }
      },
      {
        name: "transferReferralAccountParams";
        type: {
          kind: "struct"
        }
      },
      {
        name: "updateProjectParams";
        type: {
          kind: "struct";
          fields: [
            {
              name: "name";
              type: {
                "option": "string"
              }
            },
            {
              name: "defaultShareBps";
              type: {
                "option": "u16"
              }
            }
          ]
        }
      },
      {
        name: "updateReferralAccountParams";
        type: {
          kind: "struct";
          fields: [
            {
              name: "shareBps";
              type: "u16"
            }
          ]
        }
      },
      {
        name: "project";
        type: {
          kind: "struct";
          fields: [
            {
              name: "base";
              type: "pubkey"
            },
            {
              name: "admin";
              type: "pubkey"
            },
            {
              name: "name";
              type: "string"
            },
            {
              name: "defaultShareBps";
              type: "u16"
            }
          ]
        }
      },
      {
        name: "referralAccount";
        type: {
          kind: "struct";
          fields: [
            {
              name: "partner";
              type: "pubkey"
            },
            {
              name: "project";
              type: "pubkey"
            },
            {
              name: "shareBps";
              type: "u16"
            },
            {
              name: "name";
              type: {
                "option": "string"
              }
            }
          ]
        }
      },
      {
        name: "initializeProjectEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "project";
              type: "pubkey"
            },
            {
              name: "admin";
              type: "pubkey"
            },
            {
              name: "name";
              type: "string"
            },
            {
              name: "defaultShareBps";
              type: "u16"
            }
          ]
        }
      },
      {
        name: "updateProjectEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "project";
              type: "pubkey"
            },
            {
              name: "name";
              type: "string"
            },
            {
              name: "defaultShareBps";
              type: "u16"
            }
          ]
        }
      },
      {
        name: "initializeReferralAccountEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "project";
              type: "pubkey"
            },
            {
              name: "partner";
              type: "pubkey"
            },
            {
              name: "referralAccount";
              type: "pubkey"
            },
            {
              name: "shareBps";
              type: "u16"
            },
            {
              name: "name";
              type: {
                "option": "string"
              }
            }
          ]
        }
      },
      {
        name: "updateReferralAccountEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "referralAccount";
              type: "pubkey"
            },
            {
              name: "shareBps";
              type: "u16"
            }
          ]
        }
      },
      {
        name: "initializeReferralTokenAccountEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "project";
              type: "pubkey"
            },
            {
              name: "referralAccount";
              type: "pubkey"
            },
            {
              name: "referralTokenAccount";
              type: "pubkey"
            },
            {
              name: "mint";
              type: "pubkey"
            }
          ]
        }
      },
      {
        name: "claimEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "project";
              type: "pubkey"
            },
            {
              name: "projectAdminTokenAccount";
              type: "pubkey"
            },
            {
              name: "referralAccount";
              type: "pubkey"
            },
            {
              name: "referralTokenAccount";
              type: "pubkey"
            },
            {
              name: "partnerTokenAccount";
              type: "pubkey"
            },
            {
              name: "mint";
              type: "pubkey"
            },
            {
              name: "referralAmount";
              type: "u64"
            },
            {
              name: "projectAmount";
              type: "u64"
            }
          ]
        }
      }
    ]
  };
  
  

export const referralIdl: ReferralIdl = {
  version: "0.1.0",
  name: "referral",
  address: "REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3",
  metadata: {
    name: "referral",
    version: "0.1.0",
    spec: "0.1.0"
  },
  instructions: [
    {
      name: "initializeProject",
      discriminator: [
        69,
        126,
        215,
        37,
        20,
        60,
        73,
        235
      ],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true
        },
        {
          name: "base",
          signer: true
        },
        {
          name: "admin"
        },
        {
          name: "project",
          writable: true
        },
        {
          name: "systemProgram"
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: {
              name: "initializeProjectParams"
            }
          }
        }
      ]
    },
    {
      name: "initializeReferralAccount",
      discriminator: [
        92,
        25,
        0,
        243,
        230,
        205,
        254,
        67
      ],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true
        },
        {
          name: "partner"
        },
        {
          name: "project"
        },
        {
          name: "referralAccount",
          writable: true,
          signer: true
        },
        {
          name: "systemProgram"
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: {
              name: "initializeReferralAccountParams"
            }
          }
        }
      ]
    },
    {
      name: "initializeReferralAccountWithName",
      discriminator: [
        241,
        190,
        107,
        26,
        244,
        236,
        119,
        229
      ],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true
        },
        {
          name: "partner"
        },
        {
          name: "project"
        },
        {
          name: "referralAccount",
          writable: true
        },
        {
          name: "systemProgram"
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: {
              name: "initializeReferralAccountWithNameParams"
            }
          }
        }
      ]
    },
    {
      name: "updateProject",
      discriminator: [
        2,
        196,
        131,
        92,
        28,
        139,
        179,
        94
      ],
      accounts: [
        {
          name: "admin",
          signer: true
        },
        {
          name: "project",
          writable: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: {
              name: "updateProjectParams"
            }
          }
        }
      ]
    },
    {
      name: "transferProject",
      discriminator: [
        164,
        123,
        142,
        233,
        67,
        142,
        71,
        148
      ],
      accounts: [
        {
          name: "admin",
          signer: true
        },
        {
          name: "newAdmin"
        },
        {
          name: "project",
          writable: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: {
              name: "transferProjectParams"
            }
          }
        }
      ]
    },
    {
      name: "updateReferralAccount",
      discriminator: [
        216,
        83,
        99,
        19,
        220,
        191,
        74,
        197
      ],
      accounts: [
        {
          name: "admin",
          signer: true
        },
        {
          name: "project"
        },
        {
          name: "referralAccount",
          writable: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: {
              name: "updateReferralAccountParams"
            }
          }
        }
      ]
    },
    {
      name: "transferReferralAccount",
      discriminator: [
        104,
        155,
        145,
        137,
        164,
        252,
        252,
        206
      ],
      accounts: [
        {
          name: "partner",
          signer: true
        },
        {
          name: "newPartner"
        },
        {
          name: "referralAccount",
          writable: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: {
              name: "transferReferralAccountParams"
            }
          }
        }
      ]
    },
    {
      name: "initializeReferralTokenAccount",
      discriminator: [
        125,
        18,
        70,
        95,
        86,
        179,
        221,
        190
      ],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true
        },
        {
          name: "project"
        },
        {
          name: "referralAccount"
        },
        {
          name: "referralTokenAccount",
          writable: true
        },
        {
          name: "mint"
        },
        {
          name: "systemProgram"
        },
        {
          name: "tokenProgram"
        },
        {
          name: "rent"
        }
      ],
      args: []
    },
    {
      name: "claim",
      discriminator: [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true
        },
        {
          name: "project"
        },
        {
          name: "admin"
        },
        {
          name: "projectAdminTokenAccount",
          writable: true
        },
        {
          name: "referralAccount"
        },
        {
          name: "referralTokenAccount",
          writable: true
        },
        {
          name: "partner"
        },
        {
          name: "partnerTokenAccount",
          writable: true
        },
        {
          name: "mint"
        },
        {
          name: "associatedTokenProgram"
        },
        {
          name: "systemProgram"
        },
        {
          name: "tokenProgram"
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: "project",
      discriminator: [
        205,
        168,
        189,
        202,
        181,
        247,
        142,
        19
      ]
    },
    {
      name: "referralAccount",
      discriminator: [
        237,
        162,
        80,
        78,
        196,
        233,
        91,
        2
      ]
    }
  ],
  events: [
    {
      name: "initializeProjectEvent",
      discriminator: [
        21,
        246,
        143,
        111,
        211,
        184,
        130,
        71
      ]
    },
    {
      name: "updateProjectEvent",
      discriminator: [
        125,
        97,
        249,
        244,
        44,
        120,
        92,
        19
      ]
    },
    {
      name: "initializeReferralAccountEvent",
      discriminator: [
        170,
        20,
        209,
        91,
        5,
        88,
        44,
        157
      ]
    },
    {
      name: "updateReferralAccountEvent",
      discriminator: [
        190,
        248,
        57,
        59,
        79,
        136,
        239,
        20
      ]
    },
    {
      name: "initializeReferralTokenAccountEvent",
      discriminator: [
        176,
        195,
        113,
        1,
        86,
        71,
        142,
        35
      ]
    },
    {
      name: "claimEvent",
      discriminator: [
        93,
        15,
        70,
        170,
        48,
        140,
        212,
        219
      ]
    }
  ],
  errors: [
    {
      code: 6000,
      name: "invalidCalculation"
    },
    {
      code: 6001,
      name: "invalidSharePercentage"
    },
    {
      code: 6002,
      name: "nameTooLong"
    }
  ],
  types: [
    {
      name: "initializeProjectParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string"
          },
          {
            name: "defaultShareBps",
            type: "u16"
          }
        ]
      }
    },
    {
      name: "initializeReferralAccountWithNameParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string"
          }
        ]
      }
    },
    {
      name: "initializeReferralAccountParams",
      type: {
        kind: "struct"
      }
    },
    {
      name: "transferProjectParams",
      type: {
        kind: "struct"
      }
    },
    {
      name: "transferReferralAccountParams",
      type: {
        kind: "struct"
      }
    },
    {
      name: "updateProjectParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              "option": "string"
            }
          },
          {
            name: "defaultShareBps",
            type: {
              "option": "u16"
            }
          }
        ]
      }
    },
    {
      name: "updateReferralAccountParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "shareBps",
            type: "u16"
          }
        ]
      }
    },
    {
      name: "project",
      type: {
        kind: "struct",
        fields: [
          {
            name: "base",
            type: "pubkey"
          },
          {
            name: "admin",
            type: "pubkey"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "defaultShareBps",
            type: "u16"
          }
        ]
      }
    },
    {
      name: "referralAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "partner",
            type: "pubkey"
          },
          {
            name: "project",
            type: "pubkey"
          },
          {
            name: "shareBps",
            type: "u16"
          },
          {
            name: "name",
            type: {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      name: "initializeProjectEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "project",
            type: "pubkey"
          },
          {
            name: "admin",
            type: "pubkey"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "defaultShareBps",
            type: "u16"
          }
        ]
      }
    },
    {
      name: "updateProjectEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "project",
            type: "pubkey"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "defaultShareBps",
            type: "u16"
          }
        ]
      }
    },
    {
      name: "initializeReferralAccountEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "project",
            type: "pubkey"
          },
          {
            name: "partner",
            type: "pubkey"
          },
          {
            name: "referralAccount",
            type: "pubkey"
          },
          {
            name: "shareBps",
            type: "u16"
          },
          {
            name: "name",
            type: {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      name: "updateReferralAccountEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "referralAccount",
            type: "pubkey"
          },
          {
            name: "shareBps",
            type: "u16"
          }
        ]
      }
    },
    {
      name: "initializeReferralTokenAccountEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "project",
            type: "pubkey"
          },
          {
            name: "referralAccount",
            type: "pubkey"
          },
          {
            name: "referralTokenAccount",
            type: "pubkey"
          },
          {
            name: "mint",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "claimEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "project",
            type: "pubkey"
          },
          {
            name: "projectAdminTokenAccount",
            type: "pubkey"
          },
          {
            name: "referralAccount",
            type: "pubkey"
          },
          {
            name: "referralTokenAccount",
            type: "pubkey"
          },
          {
            name: "partnerTokenAccount",
            type: "pubkey"
          },
          {
            name: "mint",
            type: "pubkey"
          },
          {
            name: "referralAmount",
            type: "u64"
          },
          {
            name: "projectAmount",
            type: "u64"
          }
        ]
      }
    }
  ]
};
