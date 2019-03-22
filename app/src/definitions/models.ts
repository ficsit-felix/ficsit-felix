
interface ModelConfig {
    model: string,
    color: number
}

let modelConfig: { [id: string]: ModelConfig } = {
    // stones and materials (gray)
    "/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleLargeRock.BP_DestructibleLargeRock_C": {
        model: "",
        color: 0xaaaaaa
    },

    "/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleSmallRock.BP_DestructibleSmallRock_C": {
        model: "",
        color: 0x777777
    },
    "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C": {
        model: "",
        color: 0x444444
    },
    "/Game/FactoryGame/Resource/BP_ResourceDeposit.BP_ResourceDeposit_C": {
        model: "",
        color: 0x333333
    },

    // creatures (red)
    "/Game/FactoryGame/Character/Creature/BP_CreatureSpawner.BP_CreatureSpawner_C": {
        model: "",
        color: 0xef1d1d
    },
    "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_CrabEggParts.BP_CrabEggParts_C": {
        model: "",
        color: 0xbd6e41
    },
    "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_HogParts.BP_HogParts_C": {
        model: "",
        color: 0xa93c2c
    },
    "/Game/FactoryGame/Character/Creature/Enemy/Hog/Char_Hog.Char_Hog_C": {
        model: "",
        color: 0xd80e2c
    },
    "/Game/FactoryGame/Character/Creature/Enemy/Spitter/SmallSpitter/Char_Spitter_Small.Char_Spitter_Small_C": {
        model: "",
        color: 0xda3950
    },
    "/Game/FactoryGame/Character/Creature/Wildlife/NonFlyingBird/Char_NonFlyingBird.Char_NonFlyingBird_C": {
        model: "",
        color: 0xbc0f28
    },
    "/Game/FactoryGame/Character/Creature/Wildlife/Giraffe/Char_Giraffe.Char_Giraffe_C": {
        model: "",
        color: 0xc20f0f
    },

    // nature (green)
    "/Game/FactoryGame/World/Benefit/Mushroom/BP_Shroom_01.BP_Shroom_01_C": {
        model: "",
        color: 0x43d854
    },
    "/Game/FactoryGame/World/Benefit/BerryBush/BP_BerryBush.BP_BerryBush_C": {
        model: "",
        color: 0x2dba20
    },
    "/Game/FactoryGame/World/Benefit/NutBush/BP_NutBush.BP_NutBush_C": {
        model: "",
        color: 0x08850e
    },
    "/Game/FactoryGame/Resource/BP_ResourceNodeGeyser.BP_ResourceNodeGeyser_C": {
        model: "",
        color: 0x3caa74
    },
    // player (blue)
    "/Game/FactoryGame/Character/Player/BP_DeathMarker.BP_DeathMarker_C": {
        model: "",
        color: 0x3a5eff
    },
    "/Game/FactoryGame/-Shared/Crate/BP_Crate.BP_Crate_C": {
        model: "",
        color: 0x0c2a89
    },
    "/Game/FactoryGame/Equipment/Chainsaw/Equip_Chainsaw.Equip_Chainsaw_C": {
        model: "",
        color: 0x0c2889
    },
    "/Game/FactoryGame/Equipment/RebarGun/Equip_RebarGun_Projectile.Equip_RebarGun_Projectile_C": {
        model: "",
        color: 0x0c2289
    },
    "/Game/FactoryGame/Equipment/ColorGun/Equip_ColorGun.Equip_ColorGun_C": {
        model: "",
        color: 0x0c1289
    },
    "/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C": {
        model: "",
        color: 0x001dff
    },
    "/Game/FactoryGame/Buildable/Vehicle/BP_VehicleTargetPoint.BP_VehicleTargetPoint_C": {
        model: "",
        color: 0x4157bd
    },

    // buildings (purple)
    "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C": {
        model: "",
        color: 0x3c21c0
    },
    "/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C": {
        model: "",
        color: 0x6042d5
    },
    "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C": {
        model: "",
        color: 0x5549bf
    },
    "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C": {
        model: "",
        color: 0x5c3ba5
    },
    "/Game/FactoryGame/Buildable/Factory/Workshop/Build_Workshop.Build_Workshop_C": {
        model: "",
        color: 0x310c89
    },
    "/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBench.Build_WorkBench_C": {
        model: "",
        color: 0x472596
    },
    "/Game/FactoryGame/Buildable/Factory/Mam/Build_MamIntegrated.Build_MamIntegrated_C": {
        model: "",
        color: 0x4e2596
    },
    "/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBenchIntegrated.Build_WorkBenchIntegrated_C": {
        model: "",
        color: 0x543a83
    },
    "/Game/FactoryGame/Buildable/Factory/HubTerminal/Build_HubTerminal.Build_HubTerminal_C": {
        model: "",
        color: 0x693fb
    },
    "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayStraight.Build_WalkwayStraight_C": {
        model: "",
        color: 0x7337c6
    },
    "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayRamp.Build_WalkwayRamp_C": {
        model: "",
        color: 0x6b29aa
    },
    "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayCross.Build_WalkwayCross_C": {
        model: "",
        color: 0x7c25ce
    },
    "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set02/Build_Wall_2a.Build_Wall_2a_C": {
        model: "",
        color: 0x9525ce
    },
    "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1a.Build_Wall_1a_C": {
        model: "",
        color:
            0xab51d8
    },
    "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_02.Build_Wall_Door_8x4_02_C": {
        model: "",
        color: 0xcc81e3
    },
    "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03.Build_Wall_Conveyor_8x4_03_C": {
        model: "",
        color: 0xc658e6
    },
    "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01.Build_Wall_Conveyor_8x4_01_C": {
        model: "",
        color: 0xb714e8
    },
    "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1c.Build_Wall_1c_C": {
        model: "",
        color: 0xc514e8
    },
    "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C": {
        model: "",
        color: 0xcb4ae4
    },
    "/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C": {
        model: "",
        color: 0xd682e7
    },
    "/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Left_01.Build_Stairs_Left_01_C": {
        model: "",
        color: 0xac74b7
    },
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C": {
        model: "",
        color: 0x8d6096
    },
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C": {
        model: "",
        color: 0x894896
    },
    "/Game/FactoryGame/Buildable/Factory/JumpPad/Build_JumpPad.Build_JumpPad_C": {
        model: "",
        color: 0x872f98
    },
    "/Game/FactoryGame/Buildable/Factory/LookoutTower/Build_LookoutTower.Build_LookoutTower_C":
    {
        model: "",
        color: 0x811396
    },
    "/Game/FactoryGame/Buildable/Factory/TradingPost/Build_TradingPost.Build_TradingPost_C": {
        model: "",
        color: 0x710586
    },
    "/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C": {
        model: "",
        color: 0x5d046e
    },
    "/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StoragePlayer.Build_StoragePlayer_C": {
        model: "",
        color: 0x450352
    },
    "/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StorageIntegrated.Build_StorageIntegrated_C": {
        model: "",
        color: 0x502459
    },
    "/Game/FactoryGame/Buildable/Factory/Elevator/Build_Elevator.Build_Elevator_C": {
        model: "",
        color: 0xcb43be
    },
    "/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C": {
        model: "",
        color: 0xac139e
    },
    "/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorBiomass.Build_GeneratorBiomass_C": {
        model: "",
        color: 0xaa3da0
    },
    "/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorIntegratedBiomass.Build_GeneratorIntegratedBiomass_C": {
        model: "",
        color: 0x91498a
    },
    "/Game/FactoryGame/Buildable/Factory/GeneratorCoal/Build_GeneratorCoal.Build_GeneratorCoal_C": {
        model: "",
        color: 0x8b2f82
    },
    "/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C": {
        model: "",
        color: 0x830477
    },
    "/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C": {
        model: "",
        color: 0x63075a
    },
    "/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C": {
        model: "",
        color: 0x41063c
    },
    "/Game/FactoryGame/Buildable/Factory/CA_Splitter/Build_ConveyorAttachmentSplitter.Build_ConveyorAttachmentSplitter_C": {
        model: "",
        color: 0x5f1c59
    },
    "/Game/FactoryGame/Buildable/Factory/CA_Merger/Build_ConveyorAttachmentMerger.Build_ConveyorAttachmentMerger_C": {
        model: "",
        color: 0x693d65
    },
    "/Game/FactoryGame/Buildable/Factory/SpaceElevator/Build_SpaceElevator.Build_SpaceElevator_C": {
        model: "Build_SpaceElevator_C.glb",
        color: 0x77108a,
    },

    "/Game/FactoryGame/Equipment/Beacon/BP_Beacon.BP_Beacon_C": {
        model: "",
        color: 0xa80cff
    },
    "/Game/FactoryGame/Buildable/Vehicle/Tractor/BP_Tractor.BP_Tractor_C": {
        model: "",
        color: 0x7f28b0
    },

    // items (cyan)
    "/Script/FactoryGame.FGItemPickup_Spawnable": {
        model: "",
        color: 0x51d5e4
    },

    // specials (yellow)
    "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk3.BP_Crystal_mk3_C": {
        model: "",
        color: 0xc7b317
    },
    "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal.BP_Crystal_C": {
        model: "",
        color: 0xdccc4e
    },
    "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk2.BP_Crystal_mk2_C": {
        model: "",
        color: 0xe4da51
    },
    "/Game/FactoryGame/Prototype/WAT/BP_WAT1.BP_WAT1_C": {
        model: "",
        color: 0xaa5e2f
    },
    "/Game/FactoryGame/Prototype/WAT/BP_WAT2.BP_WAT2_C":
    {
        model: "",
        color: 0x963f1e
    },
    "/Game/FactoryGame/World/Benefit/DropPod/BP_DropPod.BP_DropPod_C":
    {
        model: "",
        color: 0xfffd00
    },

    // ??? (pink)
    "/Script/FactoryGame.FGFoliageRemoval": {
        model: "",
        color: 0x721884
    },


    "undefined": {
        model: "",
        color: 0xff00ff
    }
};

export { modelConfig };

/*
          var models = {
            "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C":
              "Build_Foundation_8x2_01_C.glb",
            "/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C":
              "Build_StorageContainerMk1_C.glb",
            "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C":
              "BP_ResourceNode_C.glb",
            "/Game/FactoryGame/Resource/BP_ResourceDeposit.BP_ResourceDeposit_C":
              "BP_ResourceDeposit_C.glb",
            "/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Left_01.Build_Stairs_Left_01_C":
              "Build_Stairs_Left_01_C.glb", // rotate z 180 z+100
            "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_02.Build_Wall_8x4_02_C":
              "Build_Wall_1a_C.glb",
            "/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C":
              "Build_Ramp_8x4_01_C.glb", // z -200
            "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C":
              "Build_Foundation_8x4_01_C.glb", // z -200
            "/Game/FactoryGame/Buildable/Vehicle/BP_VehicleTargetPoint.BP_VehicleTargetPoint_C":
              "BP_VehicleTargetPoint_C.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C":
              "Build_ConveyorPole_C.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C":
              "Build_ConveyorBelt.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C":
              "Build_ConveyorBelt.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C":
              "Build_ConveyorBelt.glb",
            "/Game/FactoryGame/World/Benefit/NutBush/BP_NutBush.BP_NutBush_C":
              "BP_NutBush_C.glb",
            "/Game/FactoryGame/World/Benefit/Mushroom/BP_Shroom_01.BP_Shroom_01_C":
              "BP_Shroom_01_C.glb",
            "/Game/FactoryGame/World/Benefit/BerryBush/BP_BerryBush.BP_BerryBush_C":
              "BP_BerryBush_C.glb",
            "/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C":
              "Build_PowerPoleMk1_C.glb",
            "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C":
              "Build_PowerLine_C.glb",
            "/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C":
              "Build_MinerMk1_C.glb", // r z 180
            "/Game/FactoryGame/Buildable/Factory/SpaceElevator/Build_SpaceElevator.Build_SpaceElevator_C":
            "Build_SpaceElevator_C.glb",
          };
*/