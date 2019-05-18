interface ModelConfig {
  model: string;
  color: number;
}

// Color palette
let wallMetalColor = 0x797979;
let wallWoodColor = 0xecb96c;

// This list is sorted alphabetically to ease adding new entries and seeing wether ones exist already
let modelConfig: { [id: string]: ModelConfig } = {
  "/Game/FactoryGame/-Shared/Blueprint/BP_BuildableSubsystem.BP_BuildableSubsystem_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/-Shared/Blueprint/BP_CircuitSubsystem.BP_CircuitSubsystem_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/-Shared/Blueprint/BP_GameMode.BP_GameMode_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/-Shared/Blueprint/BP_GameState.BP_GameState_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/-Shared/Blueprint/BP_RailroadSubsystem.BP_RailroadSubsystem_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/-Shared/Blueprint/BP_StorySubsystem.BP_StorySubsystem_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/-Shared/Blueprint/BP_TimeOfDaySubsystem.BP_TimeOfDaySubsystem_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/-Shared/Blueprint/BP_TutorialIntroManager.BP_TutorialIntroManager_C": {
    model: "",
    color: 0xff00ff
  },

  "/Game/FactoryGame/-Shared/Crate/BP_Crate.BP_Crate_C": {
    model: "Build_StoragePlayer_C.glb",
    color: 0x0c2a89
  },
  "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C": {
    model: "Build_Foundation_8x2_01_C.glb",
    color: 0x3c21c0
  },
  "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C": {
    model: "Build_Foundation_8x4_01_C.glb", // z-200
    color: 0xcb4ae4
  },
  "/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x2_01.Build_Ramp_8x2_01_C": {
    model: "Build_Ramp_8x2_01_C.glb", // z-100
    color: 0xd682e7
  },
  "/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C": {
    model: "Build_Ramp_8x4_01_C.glb", // z-200
    color: 0xd682e7
  },

  "/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Left_01.Build_Stairs_Left_01_C": {
    model: "Build_Stairs_Left_01_C.glb", // z+100
    color: 0xac74b7
  },
  "/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Right_01.Build_Stairs_Right_01_C": {
    model: "",
    color: 0xff00ff
  },

  "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayCross.Build_WalkwayCross_C": {
    model: "Walkway_Cross.glb",
    color: 0x71777a
  },
  "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayRamp.Build_WalkwayRamp_C": {
    model: "Walkway_Ramp.glb", // x - 200
    color: 0x71777a
  },
  "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayStraight.Build_WalkwayStraight_C": {
    model: "Walkway_Straight.glb", // x + 200
    color: 0x71777a
  },

  "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayT.Build_WalkwayT_C": {
    model: "Walkway_T.glb", // x -200
    color: 0x71777a
  },
  "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayTrun.Build_WalkwayTrun_C": {
    model: "Walkway_Turn.glb", // x -200 r z 90
    color: 0x71777a
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_01.Build_Wall_8x4_01_C": {
    model: "Build_Wall_1a_C.glb", 
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_02.Build_Wall_8x4_02_C": {
    model: "Build_Wall_1a_C.glb",
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01_Steel.Build_Wall_Conveyor_8x4_01_Steel_C": {
    model: "Build_Wall_Conveyor_8x4_01_C.glb", // TODO
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01.Build_Wall_Conveyor_8x4_01_C": {
    model: "Build_Wall_Conveyor_8x4_01_C.glb",
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_02_Steel.Build_Wall_Conveyor_8x4_02_Steel_C": {
    model: "Build_Wall_Conveyor_8x4_02_C.glb", // TODO
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_02.Build_Wall_Conveyor_8x4_02_C": {
    model: "Build_Wall_Conveyor_8x4_02_C.glb",
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03_Steel.Build_Wall_Conveyor_8x4_03_Steel_C": {
    model: "Build_Wall_Conveyor_8x4_03_C.glb", // TODO
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03.Build_Wall_Conveyor_8x4_03_C": {
    model: "Build_Wall_Conveyor_8x4_03_C.glb",
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_04_Steel.Build_Wall_Conveyor_8x4_04_Steel_C": {
    model: "Build_Wall_Conveyor_8x4_04_C.glb", // TODO
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_04.Build_Wall_Conveyor_8x4_04_C": {
    model: "Build_Wall_Conveyor_8x4_04_C.glb",
    color: wallWoodColor
  },

  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_01_Steel.Build_Wall_Door_8x4_01_Steel_C": {
    model: "Build_Wall_Door_8x4_01_C.glb", // TODO
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_01.Build_Wall_Door_8x4_01_C": {
    model: "Build_Wall_Door_8x4_01_C.glb",
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_02_Steel.Build_Wall_Door_8x4_02_Steel_C": {
    model: "Build_Wall_Door_8x4_02_C.glb", // TODO
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_02.Build_Wall_Door_8x4_02_C": {
    model: "Build_Wall_Door_8x4_02_C.glb",
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_03_Steel.Build_Wall_Door_8x4_03_Steel_C": {
    model: "Build_Wall_Door_8x4_03_C.glb", // TODO
    color: wallMetalColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_03.Build_Wall_Door_8x4_03_C": {
    model: "Build_Wall_Door_8x4_03_C.glb",
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Gate_8x4_01.Build_Wall_Gate_8x4_01_C": {
    model: "Build_Wall_Gate_8x4_01_C.glb",
    color: wallWoodColor
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1a.Build_Wall_1a_C": {
    model: "Build_Wall_1a_C.glb",
    color: 0xab51d8
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1c.Build_Wall_1c_C": {
    model: "Build_Wall_1a_C.glb", // TODO
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set02/Build_Wall_2a.Build_Wall_2a_C": {
    model: "Build_Wall_1a_C.glb", // TODO
    color: 0xff00ff
  },

  "/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C": {
    model: "AssemblerMk1.glb",
    color: 0x41063c
  },
  "/Game/FactoryGame/Buildable/Factory/AssemblerMk2/Build_AssemblerMk2.Build_AssemblerMk2_C": {
    model: "AssemblerMk1.glb",
    color: 0x630f53
  },
  "/Game/FactoryGame/Buildable/Factory/Converter/Build_Converter.Build_Converter_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/CA_Merger/Build_ConveyorAttachmentMerger.Build_ConveyorAttachmentMerger_C": {
    model: "ConveyorSplitter.glb",
    color: 0x693d65
  },

  "/Game/FactoryGame/Buildable/Factory/CA_Splitter/Build_ConveyorAttachmentSplitter.Build_ConveyorAttachmentSplitter_C": {
    model: "ConveyorSplitter.glb",
    color: 0x5f1c59
  },
  "/Game/FactoryGame/Buildable/Factory/CA_SplitterProgrammable/Build_ConveyorAttachmentSplitterProgrammable.Build_ConveyorAttachmentSplitterProgrammable_C": {
    model: "ConveyorSplitter.glb",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/CA_SplitterSmart/Build_ConveyorAttachmentSplitterSmart.Build_ConveyorAttachmentSplitterSmart_C": {
    model: "ConveyorSplitter.glb",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/CentralStorage/Build_CentralStorage.Build_CentralStorage_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/CheatPowerSink/Build_CheatPowerSink.Build_CheatPowerSink_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/CheatPowerSource/Build_CheatPowerSource.Build_CheatPowerSource_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/CheatResourceSink/Build_CheatResourceSink.Build_CheatResourceSink_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/CheatResourceSpawner/Build_CheatResourceSpawner.Build_CheatResourceSpawner_C": {
    model: "",
    color: 0xff00ff
  },

  "/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C": {
    model: "ConstructorMk1.glb",
    color: 0x63075a
  },
  "/Game/FactoryGame/Buildable/Factory/ConstructorMk2/Build_ConstructorMk2.Build_ConstructorMk2_C": {
    model: "ConstructorMk1.glb",
    color: 0x7a0f6e
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyoAttachmentSplitter/Build_ConveyorAttachmentSplitter.Build_ConveyorAttachmentSplitter_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorAttachmentMerger/Build_ConveyorAttachmentMerger.Build_ConveyorAttachmentMerger_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C": {
    model: "Build_ConveyorBelt.glb",
    color: 0x9750a6
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C": {
    model: "Build_ConveyorBelt.glb", // TODO
    color: 0x7b50a6
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C": {
    model: "Build_ConveyorBelt.glb", // TODO
    color: 0x5e50a6
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C": {
    model: "Build_ConveyorBelt.glb", // TODO
    color: 0x505ea6
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C": {
    model: "Build_ConveyorBelt.glb", // TODO
    color: 0x507ba6
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk4.Build_ConveyorBeltMk6_C": {
    // TODO does this exist in real saves?
    model: "Build_ConveyorBelt.glb", // TODO
    color: 0x5097a6
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C": {
    model: "Build_ConveyorBelt.glb", // TODO
    color: 0x5097a6
  },

  "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C": {
    model: "Build_ConveyorPole_C.glb",
    color: 0x5c3ba5
  },
  "/Game/FactoryGame/Buildable/Factory/ConveyorPoleStackable/Build_ConveyorPoleStackable.Build_ConveyorPoleStackable_C": {
    model: "Build_ConveyorPoleStackable_C.glb",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/Elevator/Build_Elevator.Build_Elevator_C": {
    // TODO what is this?
    model: "",
    color: 0xcb43be
  },
  "/Game/FactoryGame/Buildable/Factory/FoundryMk1/Build_FoundryMk1.Build_FoundryMk1_C": {
    model: "FoundryMk1.glb",
    color: 0x91498a
  },
  "/Game/FactoryGame/Buildable/Factory/FoundryMk2/Build_FoundryMk2.Build_FoundryMk2_C": {
    model: "FoundryMk1.glb",
    color: 0x91498a
  },

  "/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorBiomass.Build_GeneratorBiomass_C": {
    model: "GeneratorBiomass.glb",
    color: 0xaa3da0
  },
  "/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorIntegratedBiomass.Build_GeneratorIntegratedBiomass_C": {
    model: "GeneratorBiomass.glb",
    color: 0x91498a
  },
  "/Game/FactoryGame/Buildable/Factory/GeneratorCoal/Build_GeneratorCoal.Build_GeneratorCoal_C": {
    model: "GeneratorCoal.glb",
    color: 0x8b2f82
  },
  "/Game/FactoryGame/Buildable/Factory/GeneratorFuel/Build_GeneratorFuel.Build_GeneratorFuel_C": {
    model: "GeneratorFuel.glb",
    color: 0x693fb
  },
  "/Game/FactoryGame/Buildable/Factory/GeneratorGeoThermal/Build_GeneratorGeoThermal.Build_GeneratorGeoThermal_C": {
    model: "GeneratorGeoThermal.glb",
    color: 0x693fb
  },
  "/Game/FactoryGame/Buildable/Factory/GeneratorNuclear/Build_GeneratorNuclear.Build_GeneratorNuclear_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/HubTerminal/Build_HubTerminal.Build_HubTerminal_C": {
    model: "",
    color: 0x693fb
  },
  "/Game/FactoryGame/Buildable/Factory/HadronCollider/Build_HadronCollider.Build_HadronCollider_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/JumpPad/Build_JumpPad.Build_JumpPad_C": {
    model: "",
    color: 0x872f98
  },
  "/Game/FactoryGame/Buildable/Factory/JumpPad/Build_JumpPadTilted.Build_JumpPadTilted_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/LandingPad/Build_LandingPad.Build_LandingPad_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/LookoutTower/Build_LookoutTower.Build_LookoutTower_C": {
    model: "LookoutTower.glb",
    color: 0x811396
  },
  "/Game/FactoryGame/Buildable/Factory/Mam/Build_MamIntegrated.Build_MamIntegrated_C": {
    model: "",
    color: 0x4e2596
  },
  "/Game/FactoryGame/Buildable/Factory/ManufacturerMk1/Build_ManufacturerMk1.Build_ManufacturerMk1_C": {
    model: "ManufacturerMk1.glb",
    color: 0x4e2596
  },
  "/Game/FactoryGame/Buildable/Factory/ManufacturerMk2/Build_ManufacturerMk2.Build_ManufacturerMk2_C": {
    model: "ManufacturerMk1.glb",
    color: 0x6e309c
  },
  "/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C": {
    model: "Build_MinerMk1_C.glb",
    color: 0xac139e
  },
  "/Game/FactoryGame/Buildable/Factory/MinerMk2/Build_MinerMk2.Build_MinerMk2_C": {
    model: "Build_MinerMk1_C.glb",
    color: 0xce2abb
  },
  "/Game/FactoryGame/Buildable/Factory/MinerMk3/Build_MinerMk3.Build_MinerMk3_C": {
    model: "Build_MinerMk1_C.glb",
    color: 0xd638af
  },
  "/Game/FactoryGame/Buildable/Factory/OilPump/Build_OilPump.Build_OilPump_C": {
    model: "OilPump.glb",
    color: 0x5549bf
  },
  "/Game/FactoryGame/Buildable/Factory/OilRefinery/Build_OilRefinery.Build_OilRefinery_C": {
    model: "OilRefinery.glb",
    color: 0x5549bf
  },
  "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C": {
    model: "Build_PowerLine_C.glb",
    color: 0x5549bf
  },
  "/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C": {
    model: "PowerPoleMk1.glb",
    color: 0x6042d5
  },
  "/Game/FactoryGame/Buildable/Factory/PowerPoleMk2/Build_PowerPoleMk2.Build_PowerPoleMk2_C": {
    model: "PowerPoleMk2.glb",
    color: 0x6042d5
  },
  "/Game/FactoryGame/Buildable/Factory/PowerPoleMk3/Build_PowerPoleMk3.Build_PowerPoleMk3_C": {
    model: "PowerPoleMk3.glb",
    color: 0x6042d5
  },
  "/Game/FactoryGame/Buildable/Factory/PowerWall/Build_PoweredWall.Build_PoweredWall_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/QuantumEncoder/Build_QuantumEncoder.Build_QuantumEncoder_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/RadarTower/Build_RadarTower.Build_RadarTower_C": {
    model: "RadarTower.glb",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C": {
    model: "SmelterMk1.glb",
    color: 0x830477
  },
  "/Game/FactoryGame/Buildable/Factory/SmelterMk2/Build_SmelterMk2.Build_SmelterMk2_C": {
    model: "SmelterMk1.glb",
    color: 0x970c87
  },

  "/Game/FactoryGame/Buildable/Factory/SpaceElevator/Build_SpaceElevator.Build_SpaceElevator_C": {
    model: "Build_SpaceElevator_C.glb",
    color: 0x77108a
  },

  "/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C": {
    model: "Build_StorageContainerMk1_C.glb",
    color: 0x5d046e
  },
  "/Game/FactoryGame/Buildable/Factory/StorageContainerMk2/Build_StorageContainerMk2.Build_StorageContainerMk2_C": {
    model: "StorageContainerMk2.glb",
    color: 0x5d046e
  },

  "/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StorageIntegrated.Build_StorageIntegrated_C": {
    model: "Build_StoragePlayer_C.glb",
    color: 0x502459
  },

  "/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StoragePlayer.Build_StoragePlayer_C": {
    model: "Build_StoragePlayer_C.glb", // r z 90
    color: 0x450352
  },
  "/Game/FactoryGame/Buildable/Factory/TradingPost/BP_StartingPod.BP_StartingPod_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Factory/TradingPost/Build_TradingPost.Build_TradingPost_C": {
    model: "",
    color: 0x710586
  },
  "/Game/FactoryGame/Buildable/Factory/TruckStation/Build_TruckStation.Build_TruckStation_C": {
    model: "TruckStation.glb",
    color: 0x472596
  },
  "/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBench.Build_WorkBench_C": {
    model: "Workbench.glb",
    color: 0x472596
  },

  "/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBenchIntegrated.Build_WorkBenchIntegrated_C": {
    model: "Workbench.glb",
    color: 0x543a83
  },

  "/Game/FactoryGame/Buildable/Factory/Workshop/Build_Workshop.Build_Workshop_C": {
    model: "Workshop.glb",
    color: 0x310c89
  },

  "/Game/FactoryGame/Buildable/Vehicle/BP_VehicleTargetPoint.BP_VehicleTargetPoint_C": {
    model: "BP_VehicleTargetPoint_C.glb", //z+100
    color: 0x4157bd
  },
  "/Game/FactoryGame/Buildable/Vehicle/Explorer/BP_Explorer.BP_Explorer_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Buildable/Vehicle/Tractor/BP_Tractor.BP_Tractor_C": {
    model: "",
    color: 0x7f28b0
  },
  "/Game/FactoryGame/Buildable/Vehicle/Truck/BP_Truck.BP_Truck_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Character/Creature/BP_CreatureSpawner.BP_CreatureSpawner_C": {
    model: "",
    color: 0xef1d1d
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Crab/BabyCrab/Char_BabyCrab.Char_BabyCrab_C": {
    model: "",
    color: 0xff00ff,
  },
  "/Game/FactoryGame/Character/Creature/Enemy/CrabHatcher/Char_CrabHatcher.Char_CrabHatcher_C": {
    model: "",
    color: 0xd80e2c
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Hog/AlphaHog/Char_AlphaHog.Char_AlphaHog_C": {
    model: "",
    color: 0xd80e2c
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Hog/Char_Hog.Char_Hog_C": {
    model: "",
    color: 0xd80e2c
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Spitter/AlternativeSpitter/Char_Spitter_Alternative.Char_Spitter_Alternative_C": {
    model: "",
    color: 0xff00ff,
  },

  "/Game/FactoryGame/Character/Creature/Enemy/Spitter/Char_Spitter.Char_Spitter_C": {
    model: "",
    color: 0xff00ff,
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Spitter/SmallSpitter/Char_Spitter_Small.Char_Spitter_Small_C": {
    model: "",
    color: 0xda3950
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Stinger/Char_CaveStinger.Char_CaveStinger_C": {
    model: "",
    color: 0xff00ff,
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Stinger/Char_Stinger.Char_Stinger_C": {
    model: "",
    color: 0xff00ff,
  },

  "/Game/FactoryGame/Character/Creature/Enemy/Stinger/SmallStinger/Char_CaveStinger_Child.Char_CaveStinger_Child_C": {
    model: "",
    color: 0xff00ff,
  },
  "/Game/FactoryGame/Character/Creature/Enemy/Stinger/SmallStinger/Char_Stinger_Child.Char_Stinger_Child_C": {
    model: "",
    color: 0xff00ff,
  },

  "/Game/FactoryGame/Character/Creature/Wildlife/Giraffe/Char_Giraffe.Char_Giraffe_C": {
    model: "",
    color: 0xc20f0f
  },

  "/Game/FactoryGame/Character/Creature/Wildlife/NonFlyingBird/Char_NonFlyingBird.Char_NonFlyingBird_C": {
    model: "",
    color: 0xbc0f28
  },
  "/Game/FactoryGame/Character/Creature/Wildlife/SpaceGiraffe/Char_SpaceGiraffe.Char_SpaceGiraffe_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Character/Creature/Wildlife/SpaceRabbit/Char_SpaceRabbit.Char_SpaceRabbit_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Character/Player/BP_DeathMarker.BP_DeathMarker_C": {
    model: "",
    color: 0x3a5eff
  },
  "/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C": {
    model: "",
    color: 0x001dff
  },

  "/Game/FactoryGame/Equipment/-Shared/Consumeable/BP_ConsumeableEquipment.BP_ConsumeableEquipment_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/Beacon/BP_Beacon.BP_Beacon_C": {
    model: "",
    color: 0xa80cff
  },
  "/Game/FactoryGame/Equipment/Beacon/Equip_Beacon.Equip_Beacon_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/C4Dispenser/BP_C4Explosive.BP_C4Explosive_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleLargeRock.BP_DestructibleLargeRock_C": {
    model: "",
    color: 0xaaaaaa
  },

  "/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleSmallRock.BP_DestructibleSmallRock_C": {
    model: "",
    color: 0x777777
  },
  "/Game/FactoryGame/Equipment/C4Dispenser/Equip_C4Dispenser.Equip_C4Dispenser_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/Chainsaw/Equip_Chainsaw.Equip_Chainsaw_C": {
    model: "",
    color: 0x0c2889
  },

  "/Game/FactoryGame/Equipment/ColorGun/Equip_ColorGun.Equip_ColorGun_C": {
    model: "",
    color: 0x0c1289
  },
  "/Game/FactoryGame/Equipment/GasMask/Equip_GasMask.Equip_GasMask_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/JetPack/Equip_JetPack.Equip_JetPack_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/JumpingStilts/Equip_JumpingStilts.Equip_JumpingStilts_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/Machinegun/Equip_Machinegun.Equip_Machinegun_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/Medkit/Equip_MedKit.Equip_MedKit_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/NobeliskDetonator/Equip_NobeliskDetonator.Equip_NobeliskDetonator_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/ObjectScanner/Equip_ObjectScanner.Equip_ObjectScanner_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/Parachute/Equip_Parachute.Equip_Parachute_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/PortableMiner/BP_PortableMiner.BP_PortableMiner_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/PortableMiner/Equip_PortableMinerDispenser.Equip_PortableMinerDispenser_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/RebarGun/Equip_RebarGun_Projectile.Equip_RebarGun_Projectile_C": {
    model: "",
    color: 0x0c2289
  },
  "/Game/FactoryGame/Equipment/RebarScatterGun/Equip_RebarScatterGun_Projectile.Equip_RebarScatterGun_Projectile_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/Rifle/Equip_Rifle_Mk2.Equip_Rifle_Mk2_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/Rifle/Equip_Rifle.Equip_Rifle_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/ShockShank/Equip_ShockShank.Equip_ShockShank_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Equipment/StunSpear/Equip_StunSpear.Equip_StunSpear_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Prototype/PrototypeEquipment/SprintingStilts/BP_SprintingStilts.BP_SprintingStilts_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Prototype/WAT/BP_WAT1.BP_WAT1_C": {
    model: "",
    color: 0xaa5e2f
  },
  "/Game/FactoryGame/Prototype/WAT/BP_WAT2.BP_WAT2_C": {
    model: "",
    color: 0x963f1e
  },
  "/Game/FactoryGame/Recipes/Research/BP_ResearchManager.BP_ResearchManager_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Resource/BP_ItemPickup_Spawnable.BP_ItemPickup_Spawnable_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Resource/BP_ResourceDeposit.BP_ResourceDeposit_C": {
    model: "BP_ResourceDeposit_C.glb",
    color: 0x333333
  },
  "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C": {
    model: "BP_ResourceNode_C.glb",
    color: 0x444444
  },

  "/Game/FactoryGame/Resource/BP_ResourceNodeGeyser.BP_ResourceNodeGeyser_C": {
    model: "",
    color: 0x3caa74
  },

  "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_AlphaHogParts.BP_AlphaHogParts_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_CrabEggParts.BP_CrabEggParts_C": {
    model: "",
    color: 0xbd6e41
  },
  "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_HogParts.BP_HogParts_C": {
    model: "",
    color: 0xa93c2c
  },
  "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_SpitterParts.BP_SpitterParts_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk2.BP_Crystal_mk2_C": {
    model: "",
    color: 0xe4da51
  },
  "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk3.BP_Crystal_mk3_C": {
    model: "",
    color: 0xc7b317
  },
  "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal.BP_Crystal_C": {
    model: "",
    color: 0xdccc4e
  },
  "/Game/FactoryGame/Schematics/Progression/BP_GamePhaseManager.BP_GamePhaseManager_C": {
    model: "",
    color: 0xff00ff
  },
  "/Game/FactoryGame/Schematics/Progression/BP_SchematicManager.BP_SchematicManager_C": {
    model: "",
    color: 0xff00ff
  },

  "/Game/FactoryGame/World/Benefit/BerryBush/BP_BerryBush.BP_BerryBush_C": {
    model: "BP_BerryBush_C.glb",
    color: 0x2dba20
  },
  "/Game/FactoryGame/World/Benefit/DropPod/BP_DropPod.BP_DropPod_C": {
    model: "",
    color: 0xfffd00
  },
  "/Game/FactoryGame/World/Benefit/Mushroom/BP_Shroom_01.BP_Shroom_01_C": {
    model: "BP_Shroom_01_C.glb",
    color: 0x43d854
  },
  "/Game/FactoryGame/World/Benefit/NutBush/BP_NutBush.BP_NutBush_C": {
    model: "BP_NutBush_C.glb",
    color: 0x08850e
  },
  "/Game/FactoryGame/World/Hazard/SporeCloudPlant/BP_SporeFlower.BP_SporeFlower_C": {
    model: "",
    color: 0xff00ff
  },
  "/Script/FactoryGame.FGFoliageRemoval": {
    model: "",
    color: 0x721884
  },
  "/Script/FactoryGame.FGFoundationSubsystem": {
    model: "",
    color: 0xff00ff
  },
  "/Script/FactoryGame.FGItemPickup_Spawnable": {
    model: "",
    color: 0x51d5e4
  },
  "/Script/FactoryGame.FGMapManager": {
    model: "",
    color: 0xff00ff
  },
  "/Script/FactoryGame.FGRecipeManager": {
    model: "",
    color: 0xff00ff
  },
  "/Script/FactoryGame.FGWorldSettings": {
    model: "",
    color: 0xff00ff
  },

  // stones and materials (gray)
  // creatures (red)
  // nature (green)
  // player (blue)
  // buildings (purple)
  // Walls
  // items (cyan)
  // specials (yellow)
  // ??? (pink)

  undefined: {
    model: "",
    color: 0xff00ff
  }
};

console.log(modelConfig);
export { modelConfig };
