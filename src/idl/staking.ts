export type StakingIdl = {
  "address": "voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj",
  "metadata": {
    "name": "lockedVoter",
    "version": "0.2.0",
    "spec": "0.1.0"
  },
  "docs": [
    "Locked voter program."
  ],
  "instructions": [
    {
      "name": "newLocker",
      "docs": [
        "Creates a new [Locker]."
      ],
      "discriminator": [
        177,
        133,
        32,
        90,
        229,
        216,
        131,
        47
      ],
      "accounts": [
        {
          "name": "base",
          "docs": [
            "Base."
          ],
          "signer": true
        },
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "tokenMint",
          "docs": [
            "Mint of the token that can be used to join the [Locker]."
          ]
        },
        {
          "name": "governor",
          "docs": [
            "[Governor] associated with the [Locker]."
          ]
        },
        {
          "name": "payer",
          "docs": [
            "Payer of the initialization."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program."
          ]
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "lockerParams"
            }
          }
        }
      ]
    },
    {
      "name": "newEscrow",
      "docs": [
        "Creates a new [Escrow] for an account.",
        "",
        "A Vote Escrow, or [Escrow] for short, is an agreement between an account (known as the `authority`) and the DAO to",
        "lock up tokens for a specific period of time, in exchange for voting rights",
        "linearly proportional to the amount of votes given."
      ],
      "discriminator": [
        216,
        182,
        143,
        11,
        220,
        38,
        86,
        185
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner"
        },
        {
          "name": "payer",
          "docs": [
            "Payer of the initialization."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "increaseLockedAmount",
      "docs": [
        "increase locked amount [Escrow]."
      ],
      "discriminator": [
        5,
        168,
        118,
        53,
        72,
        46,
        203,
        146
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowTokens",
          "docs": [
            "Token account held by the [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "Authority [Self::source_tokens], Anyone can increase amount for user"
          ],
          "signer": true
        },
        {
          "name": "sourceTokens",
          "docs": [
            "The source of deposited tokens."
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program."
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "extendLockDuration",
      "docs": [
        "extend locked duration [Escrow]."
      ],
      "discriminator": [
        177,
        105,
        196,
        129,
        153,
        137,
        136,
        230
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ]
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "Authority of the [Escrow] and"
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "duration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "toggleMaxLock",
      "docs": [
        "toogle max lock [Escrow]."
      ],
      "discriminator": [
        163,
        157,
        161,
        132,
        179,
        107,
        127,
        143
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ]
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "Authority of the [Escrow] and"
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "isMaxLock",
          "type": "bool"
        }
      ]
    },
    {
      "name": "withdraw",
      "docs": [
        "Exits the DAO; i.e., withdraws all staked tokens in an [Escrow] if the [Escrow] is unlocked."
      ],
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker] being exited from."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "The [Escrow] that is being closed."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "Authority of the [Escrow]."
          ],
          "signer": true
        },
        {
          "name": "escrowTokens",
          "docs": [
            "Tokens locked up in the [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "destinationTokens",
          "docs": [
            "Destination for the tokens to unlock."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer to receive the rent refund."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "activateProposal",
      "docs": [
        "Activates a proposal in token launch phase"
      ],
      "discriminator": [
        90,
        186,
        203,
        234,
        70,
        185,
        191,
        21
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker]."
          ]
        },
        {
          "name": "governor",
          "docs": [
            "The [Governor]."
          ]
        },
        {
          "name": "proposal",
          "docs": [
            "The [Proposal]."
          ],
          "writable": true
        },
        {
          "name": "governProgram",
          "docs": [
            "The [govern] program."
          ]
        },
        {
          "name": "smartWallet",
          "docs": [
            "The smart wallet on the [Governor]."
          ],
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "castVote",
      "docs": [
        "Casts a vote."
      ],
      "discriminator": [
        20,
        212,
        15,
        189,
        69,
        180,
        69,
        151
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker]."
          ]
        },
        {
          "name": "escrow",
          "docs": [
            "The [Escrow] that is voting."
          ]
        },
        {
          "name": "voteDelegate",
          "docs": [
            "Vote delegate of the [Escrow]."
          ],
          "signer": true
        },
        {
          "name": "proposal",
          "docs": [
            "The [Proposal] being voted on."
          ],
          "writable": true
        },
        {
          "name": "vote",
          "docs": [
            "The [Vote]."
          ],
          "writable": true
        },
        {
          "name": "governor",
          "docs": [
            "The [Governor]."
          ]
        },
        {
          "name": "governProgram",
          "docs": [
            "The [govern] program."
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": "u8"
        }
      ]
    },
    {
      "name": "setVoteDelegate",
      "docs": [
        "Delegate escrow vote."
      ],
      "discriminator": [
        46,
        236,
        241,
        243,
        251,
        108,
        156,
        12
      ],
      "accounts": [
        {
          "name": "escrow",
          "docs": [
            "The [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "The owner of the [Escrow]."
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newDelegate",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setLockerParams",
      "docs": [
        "Set locker params."
      ],
      "discriminator": [
        106,
        39,
        132,
        84,
        254,
        77,
        161,
        169
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker]."
          ],
          "writable": true
        },
        {
          "name": "governor",
          "docs": [
            "The [Governor]."
          ]
        },
        {
          "name": "smartWallet",
          "docs": [
            "The smart wallet on the [Governor]."
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "lockerParams"
            }
          }
        }
      ]
    },
    {
      "name": "openPartialUnstaking",
      "docs": [
        "Open partial unstaking"
      ],
      "discriminator": [
        201,
        137,
        207,
        175,
        79,
        95,
        220,
        27
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "partialUnstake",
          "docs": [
            "[Escrow]."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program."
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "string"
        }
      ]
    },
    {
      "name": "mergePartialUnstaking",
      "docs": [
        "Merge partial unstaking"
      ],
      "discriminator": [
        190,
        154,
        163,
        153,
        168,
        115,
        40,
        173
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "partialUnstake",
          "docs": [
            "The [PartialUnstaking] that is being merged."
          ],
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "withdrawPartialUnstaking",
      "docs": [
        "Withdraw partial unstaking"
      ],
      "discriminator": [
        201,
        202,
        137,
        124,
        2,
        3,
        245,
        87
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker] being exited from."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "The [Escrow] that is being closed."
          ],
          "writable": true
        },
        {
          "name": "partialUnstake",
          "docs": [
            "The [PartialUnstaking] that is being withdraw."
          ],
          "writable": true
        },
        {
          "name": "owner",
          "docs": [
            "Authority of the [Escrow]."
          ],
          "signer": true
        },
        {
          "name": "escrowTokens",
          "docs": [
            "Tokens locked up in the [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "destinationTokens",
          "docs": [
            "Destination for the tokens to unlock."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer to receive the rent refund."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program."
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "locker",
      "discriminator": [
        74,
        246,
        6,
        113,
        249,
        228,
        75,
        169
      ]
    },
    {
      "name": "escrow",
      "discriminator": [
        31,
        213,
        123,
        187,
        186,
        22,
        218,
        155
      ]
    },
    {
      "name": "partialUnstaking",
      "discriminator": [
        172,
        146,
        58,
        213,
        40,
        250,
        107,
        63
      ]
    }
  ],
  "events": [
    {
      "name": "extendLockDurationEvent",
      "discriminator": [
        56,
        121,
        52,
        182,
        84,
        133,
        195,
        191
      ]
    },
    {
      "name": "increaseLockedAmountEvent",
      "discriminator": [
        100,
        70,
        156,
        246,
        40,
        169,
        119,
        10
      ]
    },
    {
      "name": "mergePartialUnstakingEvent",
      "discriminator": [
        144,
        54,
        22,
        42,
        231,
        68,
        85,
        65
      ]
    },
    {
      "name": "newEscrowEvent",
      "discriminator": [
        96,
        82,
        181,
        204,
        84,
        177,
        72,
        141
      ]
    },
    {
      "name": "newLockerEvent",
      "discriminator": [
        149,
        31,
        207,
        106,
        172,
        155,
        65,
        110
      ]
    },
    {
      "name": "openPartialStakingEvent",
      "discriminator": [
        56,
        151,
        51,
        15,
        89,
        64,
        183,
        201
      ]
    },
    {
      "name": "lockerSetParamsEvent",
      "discriminator": [
        239,
        24,
        209,
        234,
        210,
        143,
        7,
        202
      ]
    },
    {
      "name": "setVoteDelegateEvent",
      "discriminator": [
        165,
        160,
        157,
        241,
        121,
        34,
        54,
        8
      ]
    },
    {
      "name": "withdrawPartialUnstakingEvent",
      "discriminator": [
        19,
        40,
        16,
        28,
        107,
        45,
        42,
        83
      ]
    },
    {
      "name": "exitEscrowEvent",
      "discriminator": [
        218,
        91,
        68,
        189,
        102,
        152,
        212,
        166
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "lockupDurationTooShort",
      "msg": "Lockup duration must at least be the min stake duration"
    },
    {
      "code": 6001,
      "name": "lockupDurationTooLong",
      "msg": "Lockup duration must at most be the max stake duration"
    },
    {
      "code": 6002,
      "name": "refreshCannotShorten",
      "msg": "A voting escrow refresh cannot shorten the escrow time remaining"
    },
    {
      "code": 6003,
      "name": "escrowNotEnded",
      "msg": "Escrow has not ended"
    },
    {
      "code": 6004,
      "name": "maxLockIsSet",
      "msg": "Maxlock is set"
    },
    {
      "code": 6005,
      "name": "expirationIsLessThanCurrentTime",
      "msg": "Cannot set expiration less than the current time"
    },
    {
      "code": 6006,
      "name": "lockerIsExpired",
      "msg": "Locker is expired"
    },
    {
      "code": 6007,
      "name": "expirationIsNotZero",
      "msg": "Expiration is not zero"
    },
    {
      "code": 6008,
      "name": "amountIsZero",
      "msg": "Amount is zero"
    },
    {
      "code": 6009,
      "name": "maxLockIsNotSet",
      "msg": "Maxlock is not set"
    },
    {
      "code": 6010,
      "name": "invalidAmountForPartialUnstaking",
      "msg": "Invalid amount for partial unstaking"
    },
    {
      "code": 6011,
      "name": "escrowHasBeenEnded",
      "msg": "Escrow has been ended"
    },
    {
      "code": 6012,
      "name": "invalidUnstakingLockDuration",
      "msg": "Invalid unstaking lock duration"
    },
    {
      "code": 6013,
      "name": "partialUnstakingAmountIsNotZero",
      "msg": "Partial unstaking amount is not zero"
    },
    {
      "code": 6014,
      "name": "partialUnstakingIsNotEnded",
      "msg": "Partial unstaking has not ended"
    }
  ],
  "types": [
    {
      "name": "lockerParams",
      "docs": [
        "Contains parameters for the [Locker]."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxStakeVoteMultiplier",
            "docs": [
              "The weight of a maximum vote lock relative to the total number of tokens locked.",
              "For example, veCRV is 10 because 1 CRV locked for 4 years = 10 veCRV."
            ],
            "type": "u8"
          },
          {
            "name": "minStakeDuration",
            "docs": [
              "Minimum staking duration."
            ],
            "type": "u64"
          },
          {
            "name": "maxStakeDuration",
            "docs": [
              "Maximum staking duration."
            ],
            "type": "u64"
          },
          {
            "name": "proposalActivationMinVotes",
            "docs": [
              "Minimum number of votes required to activate a proposal."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "locker",
      "docs": [
        "A group of [Escrow]s."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "base",
            "docs": [
              "Base account used to generate signer seeds."
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed."
            ],
            "type": "u8"
          },
          {
            "name": "tokenMint",
            "docs": [
              "Mint of the token that must be locked in the [Locker]."
            ],
            "type": "pubkey"
          },
          {
            "name": "lockedSupply",
            "docs": [
              "Total number of tokens locked in [Escrow]s."
            ],
            "type": "u64"
          },
          {
            "name": "totalEscrow",
            "docs": [
              "Total number of escrow"
            ],
            "type": "u64"
          },
          {
            "name": "governor",
            "docs": [
              "Governor associated with the [Locker]."
            ],
            "type": "pubkey"
          },
          {
            "name": "params",
            "docs": [
              "Mutable parameters of how a [Locker] should behave."
            ],
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          },
          {
            "name": "buffers",
            "docs": [
              "buffer for further use"
            ],
            "type": {
              "array": [
                "u128",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "escrow",
      "docs": [
        "Locks tokens on behalf of a user."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "docs": [
              "The [Locker] that this [Escrow] is part of."
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "The key of the account that is authorized to stake into/withdraw from this [Escrow]."
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed."
            ],
            "type": "u8"
          },
          {
            "name": "tokens",
            "docs": [
              "The token account holding the escrow tokens."
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens staked."
            ],
            "type": "u64"
          },
          {
            "name": "escrowStartedAt",
            "docs": [
              "When the [Escrow::owner] started their escrow."
            ],
            "type": "i64"
          },
          {
            "name": "escrowEndsAt",
            "docs": [
              "When the escrow unlocks; i.e. the [Escrow::owner] is scheduled to be allowed to withdraw their tokens."
            ],
            "type": "i64"
          },
          {
            "name": "voteDelegate",
            "docs": [
              "Account that is authorized to vote on behalf of this [Escrow].",
              "Defaults to the [Escrow::owner]."
            ],
            "type": "pubkey"
          },
          {
            "name": "isMaxLock",
            "docs": [
              "Max lock"
            ],
            "type": "bool"
          },
          {
            "name": "partialUnstakingAmount",
            "docs": [
              "total amount of partial unstaking amount"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "padding for further use"
            ],
            "type": "u64"
          },
          {
            "name": "buffers",
            "docs": [
              "buffer for further use"
            ],
            "type": {
              "array": [
                "u128",
                9
              ]
            }
          }
        ]
      }
    },
    {
      "name": "partialUnstaking",
      "docs": [
        "Account to store infor for partial unstaking"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "docs": [
              "The [Escrow] pubkey."
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of this partial unstaking"
            ],
            "type": "u64"
          },
          {
            "name": "expiration",
            "docs": [
              "Timestamp when owner can withdraw the partial unstaking amount"
            ],
            "type": "i64"
          },
          {
            "name": "buffers",
            "docs": [
              "buffer for further use"
            ],
            "type": {
              "array": [
                "u128",
                6
              ]
            }
          },
          {
            "name": "memo",
            "docs": [
              "Memo"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "extendLockDurationEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "prevEscrowEndsAt",
            "type": "i64"
          },
          {
            "name": "nextEscrowEndsAt",
            "type": "i64"
          },
          {
            "name": "nextEscrowStartedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "increaseLockedAmountEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "mergePartialUnstakingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "partialUnstake",
            "type": "pubkey"
          },
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "newEscrowEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "newLockerEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "governor",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "params",
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          }
        ]
      }
    },
    {
      "name": "openPartialStakingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "partialUnstake",
            "type": "pubkey"
          },
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "expiration",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "lockerSetParamsEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "prevParams",
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          },
          {
            "name": "params",
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          }
        ]
      }
    },
    {
      "name": "setVoteDelegateEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "oldDelegate",
            "type": "pubkey"
          },
          {
            "name": "newDelegate",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "withdrawPartialUnstakingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "partialUnstaking",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          },
          {
            "name": "releasedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "exitEscrowEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          },
          {
            "name": "releasedAmount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const stakingIdl: StakingIdl = {
  "address": "voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj",
  "metadata": {
    "name": "lockedVoter",
    "version": "0.2.0",
    "spec": "0.1.0"
  },
  "docs": [
    "Locked voter program."
  ],
  "instructions": [
    {
      "name": "newLocker",
      "docs": [
        "Creates a new [Locker]."
      ],
      "discriminator": [
        177,
        133,
        32,
        90,
        229,
        216,
        131,
        47
      ],
      "accounts": [
        {
          "name": "base",
          "docs": [
            "Base."
          ],
          "signer": true
        },
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "tokenMint",
          "docs": [
            "Mint of the token that can be used to join the [Locker]."
          ]
        },
        {
          "name": "governor",
          "docs": [
            "[Governor] associated with the [Locker]."
          ]
        },
        {
          "name": "payer",
          "docs": [
            "Payer of the initialization."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program."
          ]
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "lockerParams"
            }
          }
        }
      ]
    },
    {
      "name": "newEscrow",
      "docs": [
        "Creates a new [Escrow] for an account.",
        "",
        "A Vote Escrow, or [Escrow] for short, is an agreement between an account (known as the `authority`) and the DAO to",
        "lock up tokens for a specific period of time, in exchange for voting rights",
        "linearly proportional to the amount of votes given."
      ],
      "discriminator": [
        216,
        182,
        143,
        11,
        220,
        38,
        86,
        185
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner"
        },
        {
          "name": "payer",
          "docs": [
            "Payer of the initialization."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "increaseLockedAmount",
      "docs": [
        "increase locked amount [Escrow]."
      ],
      "discriminator": [
        5,
        168,
        118,
        53,
        72,
        46,
        203,
        146
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowTokens",
          "docs": [
            "Token account held by the [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "Authority [Self::source_tokens], Anyone can increase amount for user"
          ],
          "signer": true
        },
        {
          "name": "sourceTokens",
          "docs": [
            "The source of deposited tokens."
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program."
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "extendLockDuration",
      "docs": [
        "extend locked duration [Escrow]."
      ],
      "discriminator": [
        177,
        105,
        196,
        129,
        153,
        137,
        136,
        230
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ]
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "Authority of the [Escrow] and"
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "duration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "toggleMaxLock",
      "docs": [
        "toogle max lock [Escrow]."
      ],
      "discriminator": [
        163,
        157,
        161,
        132,
        179,
        107,
        127,
        143
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ]
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "Authority of the [Escrow] and"
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "isMaxLock",
          "type": "bool"
        }
      ]
    },
    {
      "name": "withdraw",
      "docs": [
        "Exits the DAO; i.e., withdraws all staked tokens in an [Escrow] if the [Escrow] is unlocked."
      ],
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker] being exited from."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "The [Escrow] that is being closed."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "Authority of the [Escrow]."
          ],
          "signer": true
        },
        {
          "name": "escrowTokens",
          "docs": [
            "Tokens locked up in the [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "destinationTokens",
          "docs": [
            "Destination for the tokens to unlock."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer to receive the rent refund."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "activateProposal",
      "docs": [
        "Activates a proposal in token launch phase"
      ],
      "discriminator": [
        90,
        186,
        203,
        234,
        70,
        185,
        191,
        21
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker]."
          ]
        },
        {
          "name": "governor",
          "docs": [
            "The [Governor]."
          ]
        },
        {
          "name": "proposal",
          "docs": [
            "The [Proposal]."
          ],
          "writable": true
        },
        {
          "name": "governProgram",
          "docs": [
            "The [govern] program."
          ]
        },
        {
          "name": "smartWallet",
          "docs": [
            "The smart wallet on the [Governor]."
          ],
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "castVote",
      "docs": [
        "Casts a vote."
      ],
      "discriminator": [
        20,
        212,
        15,
        189,
        69,
        180,
        69,
        151
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker]."
          ]
        },
        {
          "name": "escrow",
          "docs": [
            "The [Escrow] that is voting."
          ]
        },
        {
          "name": "voteDelegate",
          "docs": [
            "Vote delegate of the [Escrow]."
          ],
          "signer": true
        },
        {
          "name": "proposal",
          "docs": [
            "The [Proposal] being voted on."
          ],
          "writable": true
        },
        {
          "name": "vote",
          "docs": [
            "The [Vote]."
          ],
          "writable": true
        },
        {
          "name": "governor",
          "docs": [
            "The [Governor]."
          ]
        },
        {
          "name": "governProgram",
          "docs": [
            "The [govern] program."
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": "u8"
        }
      ]
    },
    {
      "name": "setVoteDelegate",
      "docs": [
        "Delegate escrow vote."
      ],
      "discriminator": [
        46,
        236,
        241,
        243,
        251,
        108,
        156,
        12
      ],
      "accounts": [
        {
          "name": "escrow",
          "docs": [
            "The [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "escrowOwner",
          "docs": [
            "The owner of the [Escrow]."
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newDelegate",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setLockerParams",
      "docs": [
        "Set locker params."
      ],
      "discriminator": [
        106,
        39,
        132,
        84,
        254,
        77,
        161,
        169
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker]."
          ],
          "writable": true
        },
        {
          "name": "governor",
          "docs": [
            "The [Governor]."
          ]
        },
        {
          "name": "smartWallet",
          "docs": [
            "The smart wallet on the [Governor]."
          ],
          "signer": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "lockerParams"
            }
          }
        }
      ]
    },
    {
      "name": "openPartialUnstaking",
      "docs": [
        "Open partial unstaking"
      ],
      "discriminator": [
        201,
        137,
        207,
        175,
        79,
        95,
        220,
        27
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "partialUnstake",
          "docs": [
            "[Escrow]."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program."
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "string"
        }
      ]
    },
    {
      "name": "mergePartialUnstaking",
      "docs": [
        "Merge partial unstaking"
      ],
      "discriminator": [
        190,
        154,
        163,
        153,
        168,
        115,
        40,
        173
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "[Locker]."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "[Escrow]."
          ],
          "writable": true
        },
        {
          "name": "partialUnstake",
          "docs": [
            "The [PartialUnstaking] that is being merged."
          ],
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "withdrawPartialUnstaking",
      "docs": [
        "Withdraw partial unstaking"
      ],
      "discriminator": [
        201,
        202,
        137,
        124,
        2,
        3,
        245,
        87
      ],
      "accounts": [
        {
          "name": "locker",
          "docs": [
            "The [Locker] being exited from."
          ],
          "writable": true
        },
        {
          "name": "escrow",
          "docs": [
            "The [Escrow] that is being closed."
          ],
          "writable": true
        },
        {
          "name": "partialUnstake",
          "docs": [
            "The [PartialUnstaking] that is being withdraw."
          ],
          "writable": true
        },
        {
          "name": "owner",
          "docs": [
            "Authority of the [Escrow]."
          ],
          "signer": true
        },
        {
          "name": "escrowTokens",
          "docs": [
            "Tokens locked up in the [Escrow]."
          ],
          "writable": true
        },
        {
          "name": "destinationTokens",
          "docs": [
            "Destination for the tokens to unlock."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer to receive the rent refund."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program."
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "locker",
      "discriminator": [
        74,
        246,
        6,
        113,
        249,
        228,
        75,
        169
      ]
    },
    {
      "name": "escrow",
      "discriminator": [
        31,
        213,
        123,
        187,
        186,
        22,
        218,
        155
      ]
    },
    {
      "name": "partialUnstaking",
      "discriminator": [
        172,
        146,
        58,
        213,
        40,
        250,
        107,
        63
      ]
    }
  ],
  "events": [
    {
      "name": "extendLockDurationEvent",
      "discriminator": [
        56,
        121,
        52,
        182,
        84,
        133,
        195,
        191
      ]
    },
    {
      "name": "increaseLockedAmountEvent",
      "discriminator": [
        100,
        70,
        156,
        246,
        40,
        169,
        119,
        10
      ]
    },
    {
      "name": "mergePartialUnstakingEvent",
      "discriminator": [
        144,
        54,
        22,
        42,
        231,
        68,
        85,
        65
      ]
    },
    {
      "name": "newEscrowEvent",
      "discriminator": [
        96,
        82,
        181,
        204,
        84,
        177,
        72,
        141
      ]
    },
    {
      "name": "newLockerEvent",
      "discriminator": [
        149,
        31,
        207,
        106,
        172,
        155,
        65,
        110
      ]
    },
    {
      "name": "openPartialStakingEvent",
      "discriminator": [
        56,
        151,
        51,
        15,
        89,
        64,
        183,
        201
      ]
    },
    {
      "name": "lockerSetParamsEvent",
      "discriminator": [
        239,
        24,
        209,
        234,
        210,
        143,
        7,
        202
      ]
    },
    {
      "name": "setVoteDelegateEvent",
      "discriminator": [
        165,
        160,
        157,
        241,
        121,
        34,
        54,
        8
      ]
    },
    {
      "name": "withdrawPartialUnstakingEvent",
      "discriminator": [
        19,
        40,
        16,
        28,
        107,
        45,
        42,
        83
      ]
    },
    {
      "name": "exitEscrowEvent",
      "discriminator": [
        218,
        91,
        68,
        189,
        102,
        152,
        212,
        166
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "lockupDurationTooShort",
      "msg": "Lockup duration must at least be the min stake duration"
    },
    {
      "code": 6001,
      "name": "lockupDurationTooLong",
      "msg": "Lockup duration must at most be the max stake duration"
    },
    {
      "code": 6002,
      "name": "refreshCannotShorten",
      "msg": "A voting escrow refresh cannot shorten the escrow time remaining"
    },
    {
      "code": 6003,
      "name": "escrowNotEnded",
      "msg": "Escrow has not ended"
    },
    {
      "code": 6004,
      "name": "maxLockIsSet",
      "msg": "Maxlock is set"
    },
    {
      "code": 6005,
      "name": "expirationIsLessThanCurrentTime",
      "msg": "Cannot set expiration less than the current time"
    },
    {
      "code": 6006,
      "name": "lockerIsExpired",
      "msg": "Locker is expired"
    },
    {
      "code": 6007,
      "name": "expirationIsNotZero",
      "msg": "Expiration is not zero"
    },
    {
      "code": 6008,
      "name": "amountIsZero",
      "msg": "Amount is zero"
    },
    {
      "code": 6009,
      "name": "maxLockIsNotSet",
      "msg": "Maxlock is not set"
    },
    {
      "code": 6010,
      "name": "invalidAmountForPartialUnstaking",
      "msg": "Invalid amount for partial unstaking"
    },
    {
      "code": 6011,
      "name": "escrowHasBeenEnded",
      "msg": "Escrow has been ended"
    },
    {
      "code": 6012,
      "name": "invalidUnstakingLockDuration",
      "msg": "Invalid unstaking lock duration"
    },
    {
      "code": 6013,
      "name": "partialUnstakingAmountIsNotZero",
      "msg": "Partial unstaking amount is not zero"
    },
    {
      "code": 6014,
      "name": "partialUnstakingIsNotEnded",
      "msg": "Partial unstaking has not ended"
    }
  ],
  "types": [
    {
      "name": "lockerParams",
      "docs": [
        "Contains parameters for the [Locker]."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxStakeVoteMultiplier",
            "docs": [
              "The weight of a maximum vote lock relative to the total number of tokens locked.",
              "For example, veCRV is 10 because 1 CRV locked for 4 years = 10 veCRV."
            ],
            "type": "u8"
          },
          {
            "name": "minStakeDuration",
            "docs": [
              "Minimum staking duration."
            ],
            "type": "u64"
          },
          {
            "name": "maxStakeDuration",
            "docs": [
              "Maximum staking duration."
            ],
            "type": "u64"
          },
          {
            "name": "proposalActivationMinVotes",
            "docs": [
              "Minimum number of votes required to activate a proposal."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "locker",
      "docs": [
        "A group of [Escrow]s."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "base",
            "docs": [
              "Base account used to generate signer seeds."
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed."
            ],
            "type": "u8"
          },
          {
            "name": "tokenMint",
            "docs": [
              "Mint of the token that must be locked in the [Locker]."
            ],
            "type": "pubkey"
          },
          {
            "name": "lockedSupply",
            "docs": [
              "Total number of tokens locked in [Escrow]s."
            ],
            "type": "u64"
          },
          {
            "name": "totalEscrow",
            "docs": [
              "Total number of escrow"
            ],
            "type": "u64"
          },
          {
            "name": "governor",
            "docs": [
              "Governor associated with the [Locker]."
            ],
            "type": "pubkey"
          },
          {
            "name": "params",
            "docs": [
              "Mutable parameters of how a [Locker] should behave."
            ],
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          },
          {
            "name": "buffers",
            "docs": [
              "buffer for further use"
            ],
            "type": {
              "array": [
                "u128",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "escrow",
      "docs": [
        "Locks tokens on behalf of a user."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "docs": [
              "The [Locker] that this [Escrow] is part of."
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "The key of the account that is authorized to stake into/withdraw from this [Escrow]."
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed."
            ],
            "type": "u8"
          },
          {
            "name": "tokens",
            "docs": [
              "The token account holding the escrow tokens."
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens staked."
            ],
            "type": "u64"
          },
          {
            "name": "escrowStartedAt",
            "docs": [
              "When the [Escrow::owner] started their escrow."
            ],
            "type": "i64"
          },
          {
            "name": "escrowEndsAt",
            "docs": [
              "When the escrow unlocks; i.e. the [Escrow::owner] is scheduled to be allowed to withdraw their tokens."
            ],
            "type": "i64"
          },
          {
            "name": "voteDelegate",
            "docs": [
              "Account that is authorized to vote on behalf of this [Escrow].",
              "Defaults to the [Escrow::owner]."
            ],
            "type": "pubkey"
          },
          {
            "name": "isMaxLock",
            "docs": [
              "Max lock"
            ],
            "type": "bool"
          },
          {
            "name": "partialUnstakingAmount",
            "docs": [
              "total amount of partial unstaking amount"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "padding for further use"
            ],
            "type": "u64"
          },
          {
            "name": "buffers",
            "docs": [
              "buffer for further use"
            ],
            "type": {
              "array": [
                "u128",
                9
              ]
            }
          }
        ]
      }
    },
    {
      "name": "partialUnstaking",
      "docs": [
        "Account to store infor for partial unstaking"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "docs": [
              "The [Escrow] pubkey."
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of this partial unstaking"
            ],
            "type": "u64"
          },
          {
            "name": "expiration",
            "docs": [
              "Timestamp when owner can withdraw the partial unstaking amount"
            ],
            "type": "i64"
          },
          {
            "name": "buffers",
            "docs": [
              "buffer for further use"
            ],
            "type": {
              "array": [
                "u128",
                6
              ]
            }
          },
          {
            "name": "memo",
            "docs": [
              "Memo"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "extendLockDurationEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "prevEscrowEndsAt",
            "type": "i64"
          },
          {
            "name": "nextEscrowEndsAt",
            "type": "i64"
          },
          {
            "name": "nextEscrowStartedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "increaseLockedAmountEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "mergePartialUnstakingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "partialUnstake",
            "type": "pubkey"
          },
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "newEscrowEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "newLockerEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "governor",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "params",
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          }
        ]
      }
    },
    {
      "name": "openPartialStakingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "partialUnstake",
            "type": "pubkey"
          },
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "expiration",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "lockerSetParamsEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "prevParams",
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          },
          {
            "name": "params",
            "type": {
              "defined": {
                "name": "lockerParams"
              }
            }
          }
        ]
      }
    },
    {
      "name": "setVoteDelegateEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "oldDelegate",
            "type": "pubkey"
          },
          {
            "name": "newDelegate",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "withdrawPartialUnstakingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "partialUnstaking",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          },
          {
            "name": "releasedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "exitEscrowEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowOwner",
            "type": "pubkey"
          },
          {
            "name": "locker",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "lockerSupply",
            "type": "u64"
          },
          {
            "name": "releasedAmount",
            "type": "u64"
          }
        ]
      }
    }
  ]
}
