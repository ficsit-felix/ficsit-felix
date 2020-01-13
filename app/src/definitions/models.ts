interface ModelConfig {
  model: string;
  color: number;
  // true if this actor can be painted with the color gun
  paintable: boolean;
  powerLineOffset?: { x: number; y: number; z: number };
}

// Color palette
let wallMetalColor = 0x797979;
let wallWoodColor = 0xecb96c;

let conveyorMk1 = 0x9750a6;
let conveyorMk2 = 0x7b50a6;
let conveyorMk3 = 0x5e50a6;
let conveyorMk4 = 0x505ea6;
let conveyorMk5 = 0x507ba6;
let conveyorMk6 = 0x5097a6;

let foundationColor = 0x756f6c;
let rampColor = 0x5f6264;

// This list is sorted alphabetically to ease adding new entries and seeing wether ones exist already
export let modelConfig: { [id: string]: ModelConfig } = {
  '/Game/FactoryGame/-Shared/Blueprint/BP_BuildableSubsystem.BP_BuildableSubsystem_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/-Shared/Blueprint/BP_CircuitSubsystem.BP_CircuitSubsystem_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/-Shared/Blueprint/BP_GameMode.BP_GameMode_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/-Shared/Blueprint/BP_GameState.BP_GameState_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/-Shared/Blueprint/BP_RailroadSubsystem.BP_RailroadSubsystem_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/-Shared/Blueprint/BP_StorySubsystem.BP_StorySubsystem_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/-Shared/Blueprint/BP_TimeOfDaySubsystem.BP_TimeOfDaySubsystem_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/-Shared/Blueprint/BP_TutorialIntroManager.BP_TutorialIntroManager_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/-Shared/Crate/BP_Crate.BP_Crate_C': {
    model: 'Build_StoragePlayer_C.glb',
    color: 0x0c2a89,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Fence/Build_Fence_01.Build_Fence_01_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_4x4_01.Build_Foundation_4x4_01_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x1_01.Build_Foundation_8x1_01_C': {
    model: 'Foundation_8x1_01.glb',
    color: foundationColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C': {
    model: 'Build_Foundation_8x2_01_C.glb',
    color: foundationColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C': {
    model: 'Build_Foundation_8x4_01_C.glb', // z-200
    color: foundationColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_Diagonal_8x2_01.Build_Foundation_Diagonal_8x2_01_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x1_01.Build_Ramp_8x1_01_C': {
    model: 'Ramp_8x1_01.glb',
    color: rampColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x2_01.Build_Ramp_8x2_01_C': {
    model: 'Build_Ramp_8x2_01_C.glb', // z-100
    color: rampColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C': {
    model: 'Build_Ramp_8x4_01_C.glb', // z-200
    color: rampColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Stair/Build_Stair_1b.Build_Stair_1b_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Left_01.Build_Stairs_Left_01_C': {
    model: 'Stairs_Left.glb', // z+100
    color: 0xac74b7,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Right_01.Build_Stairs_Right_01_C': {
    model: 'Stairs_Right.glb',
    color: 0xac74b7,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayCross.Build_WalkwayCross_C': {
    model: 'Walkway_Cross.glb',
    color: 0x71777a,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayRamp.Build_WalkwayRamp_C': {
    model: 'Walkway_Ramp.glb', // x - 200
    color: 0x71777a,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayStraight.Build_WalkwayStraight_C': {
    model: 'Walkway_Straight.glb', // x + 200
    color: 0x71777a,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayT.Build_WalkwayT_C': {
    model: 'Walkway_T.glb', // x -200
    color: 0x71777a,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayTrun.Build_WalkwayTrun_C': {
    model: 'Walkway_Turn.glb', // x -200 r z 90
    color: 0x71777a,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x1_01.Build_Wall_8x1_01_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x2_01.Build_Wall_8x2_01_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_01.Build_Wall_8x4_01_C': {
    model: 'Build_Wall_1a_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_02.Build_Wall_8x4_02_C': {
    model: 'Build_Wall_1a_C.glb',
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01_Steel.Build_Wall_Conveyor_8x4_01_Steel_C': {
    model: 'Build_Wall_Conveyor_8x4_01_C.glb', // TODO
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01.Build_Wall_Conveyor_8x4_01_C': {
    model: 'Build_Wall_Conveyor_8x4_01_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_02_Steel.Build_Wall_Conveyor_8x4_02_Steel_C': {
    model: 'Build_Wall_Conveyor_8x4_02_C.glb', // TODO
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_02.Build_Wall_Conveyor_8x4_02_C': {
    model: 'Build_Wall_Conveyor_8x4_02_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03_Steel.Build_Wall_Conveyor_8x4_03_Steel_C': {
    model: 'Build_Wall_Conveyor_8x4_03_C.glb', // TODO
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03.Build_Wall_Conveyor_8x4_03_C': {
    model: 'Build_Wall_Conveyor_8x4_03_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_04_Steel.Build_Wall_Conveyor_8x4_04_Steel_C': {
    model: 'Build_Wall_Conveyor_8x4_04_C.glb', // TODO
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_04.Build_Wall_Conveyor_8x4_04_C': {
    model: 'Build_Wall_Conveyor_8x4_04_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Diagonal_8x4_01.Build_Wall_Diagonal_8x4_01_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_01_Steel.Build_Wall_Door_8x4_01_Steel_C': {
    model: 'Build_Wall_Door_8x4_01_C.glb', // TODO
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_01.Build_Wall_Door_8x4_01_C': {
    model: 'Build_Wall_Door_8x4_01_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_02_Steel.Build_Wall_Door_8x4_02_Steel_C': {
    model: 'Build_Wall_Door_8x4_02_C.glb', // TODO
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_02.Build_Wall_Door_8x4_02_C': {
    model: 'Build_Wall_Door_8x4_02_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_03_Steel.Build_Wall_Door_8x4_03_Steel_C': {
    model: 'Build_Wall_Door_8x4_03_C.glb', // TODO
    color: wallMetalColor,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_03.Build_Wall_Door_8x4_03_C': {
    model: 'Build_Wall_Door_8x4_03_C.glb',
    color: wallWoodColor,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Gate_8x4_01.Build_Wall_Gate_8x4_01_C': {
    model: 'Build_Wall_Gate_8x4_01_C.glb',
    color: wallWoodColor,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_02.Build_Wall_Window_8x4_02_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_03.Build_Wall_Window_8x4_03_C': {
    model: 'Build_Wall_1a_C.glb', // TODO
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_04.Build_Wall_Window_8x4_04_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_Diagonal_8x4_02.Build_Wall_Window_Diagonal_8x4_02_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1a.Build_Wall_1a_C': {
    model: 'Build_Wall_1a_C.glb', // TODO
    color: 0xff00ff,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1c.Build_Wall_1c_C': {
    model: 'Build_Wall_1a_C.glb', // TODO
    color: 0xff00ff,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Building/Wall/Wall_Set02/Build_Wall_2a.Build_Wall_2a_C': {
    model: 'Build_Wall_1a_C.glb', // TODO
    color: 0xff00ff,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C': {
    model: 'AssemblerMk1.glb',
    color: 0x41063c,
    paintable: true,
    powerLineOffset: { x: 475, y: 120, z: 700 }
  },
  '/Game/FactoryGame/Buildable/Factory/AssemblerMk2/Build_AssemblerMk2.Build_AssemblerMk2_C': {
    model: 'AssemblerMk1.glb',
    color: 0x630f53,
    paintable: true,
    powerLineOffset: { x: 475, y: 120, z: 700 }
  },
  '/Game/FactoryGame/Buildable/Factory/Converter/Build_Converter.Build_Converter_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/CA_Merger/Build_ConveyorAttachmentMerger.Build_ConveyorAttachmentMerger_C': {
    model: 'ConveyorSplitter.glb',
    color: 0x693d65,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Factory/CA_Splitter/Build_ConveyorAttachmentSplitter.Build_ConveyorAttachmentSplitter_C': {
    model: 'ConveyorSplitter.glb',
    color: 0x5f1c59,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/CA_SplitterProgrammable/Build_ConveyorAttachmentSplitterProgrammable.Build_ConveyorAttachmentSplitterProgrammable_C': {
    model: 'ConveyorSplitter.glb',
    color: 0xff00ff,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/CA_SplitterSmart/Build_ConveyorAttachmentSplitterSmart.Build_ConveyorAttachmentSplitterSmart_C': {
    model: 'ConveyorSplitter.glb',
    color: 0xff00ff,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/CentralStorage/Build_CentralStorage.Build_CentralStorage_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/CheatPowerSink/Build_CheatPowerSink.Build_CheatPowerSink_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/CheatPowerSource/Build_CheatPowerSource.Build_CheatPowerSource_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/CheatResourceSink/Build_CheatResourceSink.Build_CheatResourceSink_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/CheatResourceSpawner/Build_CheatResourceSpawner.Build_CheatResourceSpawner_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C': {
    model: 'ConstructorMk1.glb',
    color: 0x63075a,
    paintable: true,
    powerLineOffset: { x: 210, y: -470, z: 690 }
  },
  '/Game/FactoryGame/Buildable/Factory/ConstructorMk2/Build_ConstructorMk2.Build_ConstructorMk2_C': {
    model: 'ConstructorMk1.glb',
    color: 0x7a0f6e,
    paintable: true,
    powerLineOffset: { x: 210, y: -470, z: 690 }
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyoAttachmentSplitter/Build_ConveyorAttachmentSplitter.Build_ConveyorAttachmentSplitter_C': {
    model: 'ConveyorSplitter.glb',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorAttachmentMerger/Build_ConveyorAttachmentMerger.Build_ConveyorAttachmentMerger_C': {
    model: 'ConveyorSplitter.glb',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C': {
    model: 'Build_ConveyorBelt.glb',
    color: conveyorMk1,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C': {
    model: 'Build_ConveyorBelt.glb', // TODO
    color: conveyorMk2,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C': {
    model: 'Build_ConveyorBelt.glb', // TODO
    color: conveyorMk3,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C': {
    model: 'Build_ConveyorBelt.glb', // TODO
    color: conveyorMk4,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C': {
    model: 'Build_ConveyorBelt.glb', // TODO
    color: conveyorMk5,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk4.Build_ConveyorBeltMk6_C': {
    // TODO does this exist in real saves?
    model: 'Build_ConveyorBelt.glb', // TODO
    color: conveyorMk6,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C': {
    model: 'Build_ConveyorBelt.glb', // TODO
    color: conveyorMk6,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C': {
    model: 'ConveyorLift_Bottom.glb',
    color: conveyorMk1,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C': {
    model: 'ConveyorLift_Bottom.glb',
    color: conveyorMk2,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C': {
    model: 'ConveyorLift_Bottom.glb',
    color: conveyorMk3,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C': {
    model: 'ConveyorLift_Bottom.glb',
    color: conveyorMk4,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk5/Build_ConveyorLiftMk5.Build_ConveyorLiftMk5_C': {
    model: 'ConveyorLift_Bottom.glb',
    color: conveyorMk5,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C': {
    model: 'Build_ConveyorPole_C.glb',
    color: 0x5c3ba5,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_2': {
    model: 'Build_ConveyorPole_2.glb',
    color: 0x5c3ba5,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_3': {
    model: 'Build_ConveyorPole_3.glb',
    color: 0x5c3ba5,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_4': {
    model: 'Build_ConveyorPole_4.glb',
    color: 0x5c3ba5,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Factory/ConveyorPoleStackable/Build_ConveyorPoleStackable.Build_ConveyorPoleStackable_C': {
    model: 'Build_ConveyorPoleStackable_C.glb',
    color: 0xff00ff,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/Elevator/Build_Elevator.Build_Elevator_C': {
    // TODO what is this?
    model: '',
    color: 0xcb43be,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/FoundryMk1/Build_FoundryMk1.Build_FoundryMk1_C': {
    model: 'FoundryMk1.glb',
    color: 0x91498a,
    paintable: false,
    powerLineOffset: { x: 420, y: -320, z: 580 }
  },
  '/Game/FactoryGame/Buildable/Factory/FoundryMk2/Build_FoundryMk2.Build_FoundryMk2_C': {
    model: 'FoundryMk1.glb',
    color: 0x91498a,
    paintable: false,
    powerLineOffset: { x: 420, y: -320, z: 580 }
  },

  '/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorBiomass.Build_GeneratorBiomass_C': {
    model: 'GeneratorBiomass.glb',
    color: 0xaa3da0,
    paintable: true,
    powerLineOffset: { x: 305, y: 185, z: 650 }
  },
  '/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorIntegratedBiomass.Build_GeneratorIntegratedBiomass_C': {
    model: 'GeneratorIntegratedBiomass.glb',
    color: 0x91498a,
    paintable: true,
    powerLineOffset: { x: -30, y: -80, z: 375 }
  },
  '/Game/FactoryGame/Buildable/Factory/GeneratorCoal/Build_GeneratorCoal.Build_GeneratorCoal_C': {
    model: 'GeneratorCoal.glb',
    color: 0x8b2f82,
    paintable: true,
    powerLineOffset: { x: -270, y: -1275, z: 950 }
  },
  '/Game/FactoryGame/Buildable/Factory/GeneratorFuel/Build_GeneratorFuel.Build_GeneratorFuel_C': {
    model: 'GeneratorFuel.glb',
    color: 0x693fb,
    paintable: true,
    powerLineOffset: { x: 0, y: 540, z: 960 }
  },
  '/Game/FactoryGame/Buildable/Factory/GeneratorGeoThermal/Build_GeneratorGeoThermal.Build_GeneratorGeoThermal_C': {
    model: 'GeneratorGeoThermal.glb',
    color: 0x693fb,
    paintable: true,
    powerLineOffset: { x: 0, y: 315, z: 1620 }
  },
  '/Game/FactoryGame/Buildable/Factory/GeneratorNuclear/Build_GeneratorNuclear.Build_GeneratorNuclear_C': {
    model: 'GeneratorNuclear.glb',
    color: 0x693fb,
    paintable: true,
    powerLineOffset: { x: -660, y: -1900, z: 900 }
  },
  '/Game/FactoryGame/Buildable/Factory/HubTerminal/Build_HubTerminal.Build_HubTerminal_C': {
    model: 'HubTerminal.glb',
    color: 0x693fb0,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/HadronCollider/Build_HadronCollider.Build_HadronCollider_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/JumpPad/Build_JumpPad.Build_JumpPad_C': {
    model: 'JumpPad.glb',
    color: 0x872f98,
    paintable: true,
    powerLineOffset: { x: -25, y: -205, z: 420 }
  },
  '/Game/FactoryGame/Buildable/Factory/JumpPad/Build_JumpPadTilted.Build_JumpPadTilted_C': {
    model: 'JumpPadTilted.glb',
    color: 0xff00ff,
    paintable: true,
    powerLineOffset: { x: -25, y: -205, z: 420 }
  },
  '/Game/FactoryGame/Buildable/Factory/LandingPad/Build_LandingPad.Build_LandingPad_C': {
    model: 'LandingPad.glb',
    color: 0xff00ff,
    paintable: true,
    powerLineOffset: { x: 400, y: 470, z: 420 }
  },
  '/Game/FactoryGame/Buildable/Factory/LookoutTower/Build_LookoutTower.Build_LookoutTower_C': {
    model: 'LookoutTower.glb',
    color: 0x811396,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/Mam/Build_MamIntegrated.Build_MamIntegrated_C': {
    model: 'MamIntegrated.glb',
    color: 0x4e2596,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/ManufacturerMk1/Build_ManufacturerMk1.Build_ManufacturerMk1_C': {
    model: 'ManufacturerMk1.glb',
    color: 0x4e2596,
    paintable: false,
    powerLineOffset: { x: 905, y: -700, z: 770 }
  },
  '/Game/FactoryGame/Buildable/Factory/ManufacturerMk2/Build_ManufacturerMk2.Build_ManufacturerMk2_C': {
    model: 'ManufacturerMk1.glb',
    color: 0x6e309c,
    paintable: false,
    powerLineOffset: { x: 905, y: -700, z: 770 }
  },
  '/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C': {
    model: 'MinerMk1.glb',
    color: 0xac139e,
    paintable: true,
    powerLineOffset: { x: 140, y: 20, z: 1800 }
  },
  '/Game/FactoryGame/Buildable/Factory/MinerMk2/Build_MinerMk2.Build_MinerMk2_C': {
    model: 'MinerMk2.glb',
    color: 0xce2abb,
    paintable: true,
    powerLineOffset: { x: -135, y: 0, z: 1800 }
  },
  '/Game/FactoryGame/Buildable/Factory/MinerMk3/Build_MinerMk3.Build_MinerMk3_C': {
    model: 'MinerMk3.glb',
    color: 0xd638af,
    paintable: true,
    powerLineOffset: { x: -135, y: 0, z: 1800 }
  },
  '/Game/FactoryGame/Buildable/Factory/OilPump/Build_OilPump.Build_OilPump_C': {
    model: 'OilPump.glb',
    color: 0x5549bf,
    paintable: false,
    powerLineOffset: { x: 100, y: -520, z: 1640 }
  },
  '/Game/FactoryGame/Buildable/Factory/OilRefinery/Build_OilRefinery.Build_OilRefinery_C': {
    model: 'OilRefinery.glb',
    color: 0x5549bf,
    paintable: false,
    powerLineOffset: { x: 0, y: -800, z: 1825 }
  },
  '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C': {
    model: 'Build_PowerLine_C.glb',
    color: 0xaaaaaa,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C': {
    model: 'PowerPoleMk1.glb',
    color: 0x6042d5,
    paintable: true,
    powerLineOffset: { x: 0, y: 0, z: 615 }
  },
  '/Game/FactoryGame/Buildable/Factory/PowerPoleMk2/Build_PowerPoleMk2.Build_PowerPoleMk2_C': {
    model: 'PowerPoleMk2.glb',
    color: 0x6042d5,
    paintable: true,
    powerLineOffset: { x: 0, y: 0, z: 715 }
  },
  '/Game/FactoryGame/Buildable/Factory/PowerPoleMk3/Build_PowerPoleMk3.Build_PowerPoleMk3_C': {
    model: 'PowerPoleMk3.glb',
    color: 0x6042d5,
    paintable: true,
    powerLineOffset: { x: 0, y: 0, z: 850 }
  },
  '/Game/FactoryGame/Buildable/Factory/PowerWall/Build_PoweredWall.Build_PoweredWall_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/QuantumEncoder/Build_QuantumEncoder.Build_QuantumEncoder_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/RadarTower/Build_RadarTower.Build_RadarTower_C': {
    model: 'RadarTower.glb',
    color: 0xaceef1,
    paintable: true,
    powerLineOffset: { x: 115, y: -340, z: 1730 }
  },
  '/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C': {
    model: 'SmelterMk1.glb',
    color: 0x830477,
    paintable: true,
    powerLineOffset: { x: 217, y: -300, z: 500 }
  },
  '/Game/FactoryGame/Buildable/Factory/SmelterMk2/Build_SmelterMk2.Build_SmelterMk2_C': {
    model: 'SmelterMk1.glb',
    color: 0x970c87,
    paintable: true,
    powerLineOffset: { x: 217, y: -300, z: 500 }
  },

  '/Game/FactoryGame/Buildable/Factory/SpaceElevator/Build_SpaceElevator.Build_SpaceElevator_C': {
    model: 'SpaceElevator.glb',
    color: 0x77108a,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C': {
    model: 'Build_StorageContainerMk1_C.glb',
    color: 0x4a4c4a,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/StorageContainerMk2/Build_StorageContainerMk2.Build_StorageContainerMk2_C': {
    model: 'StorageContainerMk2.glb',
    color: 0x4a4c4a,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StorageIntegrated.Build_StorageIntegrated_C': {
    model: 'StorageIntegrated.glb',
    color: 0x502459,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StoragePlayer.Build_StoragePlayer_C': {
    model: 'Build_StoragePlayer_C.glb', // r z 90
    color: 0x450352,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/TradingPost/BP_StartingPod.BP_StartingPod_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/TradingPost/Build_TradingPost.Build_TradingPost_C': {
    model: 'TradingPost.glb',
    color: 0xcd8734,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStation.Build_TrainDockingStation_C': {
    model: 'TrainDockingStation.glb',
    color: 0x108873,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainPlatformEmpty.Build_TrainPlatformEmpty_C': {
    model: 'TrainPlatformEmpty.glb',
    color: 0x108873,
    paintable: true
  },
  '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainStation.Build_TrainStation_C': {
    model: 'TrainStation.glb',
    color: 0x108873,
    paintable: true,
    powerLineOffset: { x: 710, y: -925, z: 1025 }
  },
  '/Game/FactoryGame/Buildable/Factory/Train/SwitchControl/Build_RailroadSwitchControl.Build_RailroadSwitchControl_C': {
    model: 'RailroadSwitchControl.glb',
    color: 0x108873,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/Train/Track/Build_RailroadTrack.Build_RailroadTrack_C': {
    model: '',
    color: 0x087764,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/Train/Track/Build_RailroadTrackIntegrated.Build_RailroadTrackIntegrated_C': {
    model: '',
    color: 0x087764,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Factory/TruckStation/Build_TruckStation.Build_TruckStation_C': {
    model: 'TruckStation.glb',
    color: 0x472596,
    paintable: true,
    powerLineOffset: { x: 165, y: -1170, z: 1080 }
  },
  '/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBench.Build_WorkBench_C': {
    model: 'Workbench.glb',
    color: 0x472596,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBenchIntegrated.Build_WorkBenchIntegrated_C': {
    model: 'WorkbenchIntegrated.glb',
    color: 0x543a83,
    paintable: false
  },

  '/Game/FactoryGame/Buildable/Factory/Workshop/Build_Workshop.Build_Workshop_C': {
    model: 'Workshop.glb',
    color: 0x310c89,
    paintable: true
  },

  '/Game/FactoryGame/Buildable/Vehicle/BP_VehicleTargetPoint.BP_VehicleTargetPoint_C': {
    model: 'BP_VehicleTargetPoint_C.glb', //z+100
    color: 0x4157bd,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Vehicle/Explorer/BP_Explorer.BP_Explorer_C': {
    model: 'Explorer.glb',
    color: 0x7f28b0,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Vehicle/Tractor/BP_Tractor.BP_Tractor_C': {
    model: 'Tractor.glb',
    color: 0x7f28b0,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Vehicle/Train/Locomotive/BP_Locomotive.BP_Locomotive_C': {
    model: 'Locomotive.glb',
    color: 0x2878b0,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Vehicle/Train/Wagon/BP_FreightWagon.BP_FreightWagon_C': {
    model: 'FreightWagon.glb',
    color: 0x2878b0,
    paintable: false
  },
  '/Game/FactoryGame/Buildable/Vehicle/Truck/BP_Truck.BP_Truck_C': {
    model: 'Truck.glb',
    color: 0x7f28b0,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/BP_CreatureSpawner.BP_CreatureSpawner_C': {
    model: '',
    color: 0xef1d1d,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Crab/BabyCrab/Char_BabyCrab.Char_BabyCrab_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/CrabHatcher/Char_CrabHatcher.Char_CrabHatcher_C': {
    model: '',
    color: 0xd80e2c,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Hog/AlphaHog/Char_AlphaHog.Char_AlphaHog_C': {
    model: '',
    color: 0xd80e2c,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Hog/Char_Hog.Char_Hog_C': {
    model: '',
    color: 0xd80e2c,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Spitter/AlternativeSpitter/Char_Spitter_Alternative.Char_Spitter_Alternative_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/Character/Creature/Enemy/Spitter/Char_Spitter.Char_Spitter_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SmallSpitter/Char_Spitter_Small.Char_Spitter_Small_C': {
    model: '',
    color: 0xda3950,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Stinger/BigStinger/Char_EliteCaveStinger.Char_EliteCaveStinger_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Stinger/Char_CaveStinger.Char_CaveStinger_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Stinger/Char_Stinger.Char_Stinger_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/Character/Creature/Enemy/Stinger/SmallStinger/Char_CaveStinger_Child.Char_CaveStinger_Child_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Enemy/Stinger/SmallStinger/Char_Stinger_Child.Char_Stinger_Child_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/Character/Creature/Wildlife/Giraffe/Char_Giraffe.Char_Giraffe_C': {
    model: '',
    color: 0xc20f0f,
    paintable: false
  },

  '/Game/FactoryGame/Character/Creature/Wildlife/NonFlyingBird/Char_NonFlyingBird.Char_NonFlyingBird_C': {
    model: '',
    color: 0xbc0f28,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Wildlife/SpaceGiraffe/Char_SpaceGiraffe.Char_SpaceGiraffe_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Creature/Wildlife/SpaceRabbit/Char_SpaceRabbit.Char_SpaceRabbit_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Player/BP_DeathMarker.BP_DeathMarker_C': {
    model: '',
    color: 0x3a5eff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C': {
    model: '',
    color: 0x001dff,
    paintable: false
  },

  '/Game/FactoryGame/Equipment/-Shared/Consumeable/BP_ConsumeableEquipment.BP_ConsumeableEquipment_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Beacon/BP_Beacon.BP_Beacon_C': {
    model: '',
    color: 0xa80cff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Beacon/Equip_Beacon.Equip_Beacon_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/C4Dispenser/BP_C4Explosive.BP_C4Explosive_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleLargeRock.BP_DestructibleLargeRock_C': {
    model: '',
    color: 0xaaaaaa,
    paintable: false
  },

  '/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleSmallRock.BP_DestructibleSmallRock_C': {
    model: '',
    color: 0x777777,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/C4Dispenser/Equip_C4Dispenser.Equip_C4Dispenser_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Chainsaw/Equip_Chainsaw.Equip_Chainsaw_C': {
    model: '',
    color: 0x0c2889,
    paintable: false
  },

  '/Game/FactoryGame/Equipment/ColorGun/Equip_ColorGun.Equip_ColorGun_C': {
    model: '',
    color: 0x0c1289,
    paintable: true
  },
  '/Game/FactoryGame/Equipment/GasMask/Equip_GasMask.Equip_GasMask_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/HazmatSuit/Equip_HazmatSuit.Equip_HazmatSuit_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/JetPack/Equip_JetPack.Equip_JetPack_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/JumpingStilts/Equip_JumpingStilts.Equip_JumpingStilts_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Machinegun/Equip_Machinegun.Equip_Machinegun_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Medkit/Equip_MedKit.Equip_MedKit_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/NobeliskDetonator/BP_NobeliskExplosive.BP_NobeliskExplosive_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/NobeliskDetonator/Equip_NobeliskDetonator.Equip_NobeliskDetonator_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/ObjectScanner/Equip_ObjectScanner.Equip_ObjectScanner_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Parachute/Equip_Parachute.Equip_Parachute_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/PortableMiner/BP_PortableMiner.BP_PortableMiner_C': {
    model: 'PortableMiner.glb',
    color: 0x5321cd,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/PortableMiner/Equip_PortableMinerDispenser.Equip_PortableMinerDispenser_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/RebarGun/Equip_RebarGun_Projectile.Equip_RebarGun_Projectile_C': {
    model: '',
    color: 0x0c2289,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/RebarScatterGun/Equip_RebarScatterGun_Projectile.Equip_RebarScatterGun_Projectile_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Rifle/Equip_Rifle_Mk2.Equip_Rifle_Mk2_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/Rifle/Equip_Rifle.Equip_Rifle_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/ShockShank/Equip_ShockShank.Equip_ShockShank_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Equipment/StunSpear/Equip_StunSpear.Equip_StunSpear_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Prototype/PrototypeEquipment/SprintingStilts/BP_SprintingStilts.BP_SprintingStilts_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Prototype/WAT/BP_WAT1.BP_WAT1_C': {
    model: 'WAT1_Sommersloop.glb',
    color: 0xaa5e2f,
    paintable: false
  },
  '/Game/FactoryGame/Prototype/WAT/BP_WAT2.BP_WAT2_C': {
    model: 'WAT2_MercerSphere.glb',
    color: 0x963f1e,
    paintable: false
  },
  '/Game/FactoryGame/Recipes/Research/BP_ResearchManager.BP_ResearchManager_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Resource/BP_ItemPickup_Spawnable.BP_ItemPickup_Spawnable_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Resource/BP_ResourceDeposit.BP_ResourceDeposit_C': {
    model: 'BP_ResourceDeposit_C.glb',
    color: 0x333333,
    paintable: false
  },
  '/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C': {
    model: 'BP_ResourceNode_C.glb',
    color: 0x444444,
    paintable: false
  },

  '/Game/FactoryGame/Resource/BP_ResourceNodeGeyser.BP_ResourceNodeGeyser_C': {
    model: 'ResourceNodeGeyser.glb',
    color: 0x3caa74,
    paintable: false
  },

  '/Game/FactoryGame/Resource/Environment/AnimalParts/BP_AlphaHogParts.BP_AlphaHogParts_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Resource/Environment/AnimalParts/BP_CrabEggParts.BP_CrabEggParts_C': {
    model: '',
    color: 0xbd6e41,
    paintable: false
  },
  '/Game/FactoryGame/Resource/Environment/AnimalParts/BP_HogParts.BP_HogParts_C': {
    model: '',
    color: 0xa93c2c,
    paintable: false
  },
  '/Game/FactoryGame/Resource/Environment/AnimalParts/BP_SpitterParts.BP_SpitterParts_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk2.BP_Crystal_mk2_C': {
    model: '',
    color: 0xe4da51,
    paintable: false
  },
  '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk3.BP_Crystal_mk3_C': {
    model: '',
    color: 0xc7b317,
    paintable: false
  },
  '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal.BP_Crystal_C': {
    model: '',
    color: 0xdccc4e,
    paintable: false
  },
  '/Game/FactoryGame/Schematics/Progression/BP_GamePhaseManager.BP_GamePhaseManager_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Game/FactoryGame/Schematics/Progression/BP_SchematicManager.BP_SchematicManager_C': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Game/FactoryGame/World/Benefit/BerryBush/BP_BerryBush.BP_BerryBush_C': {
    model: 'BP_BerryBush_C.glb',
    color: 0x2dba20,
    paintable: false
  },
  '/Game/FactoryGame/World/Benefit/DropPod/BP_DropPod.BP_DropPod_C': {
    model: 'DropPod.glb',
    color: 0xfffd00,
    paintable: false,
    powerLineOffset: { x: 0, y: -390, z: 40 }
  },
  '/Game/FactoryGame/World/Benefit/Mushroom/BP_Shroom_01.BP_Shroom_01_C': {
    model: 'BP_Shroom_01_C.glb',
    color: 0x43d854,
    paintable: false
  },
  '/Game/FactoryGame/World/Benefit/NutBush/BP_NutBush.BP_NutBush_C': {
    model: 'BP_NutBush_C.glb',
    color: 0x08850e,
    paintable: false
  },
  '/Game/FactoryGame/World/Hazard/SporeCloudPlant/BP_SporeFlower.BP_SporeFlower_C': {
    model: 'SporeCloudPlant.glb',
    color: 0xb12525,
    paintable: false
  },
  '/Script/FactoryGame.FGFoliageRemoval': {
    model: '',
    color: 0x721884,
    paintable: false
  },
  '/Script/FactoryGame.FGFoundationSubsystem': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Script/FactoryGame.FGItemPickup_Spawnable': {
    model: '',
    color: 0x51d5e4,
    paintable: false
  },
  '/Script/FactoryGame.FGMapManager': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Script/FactoryGame.FGRailroadTimeTable': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Script/FactoryGame.FGRecipeManager': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Script/FactoryGame.FGTrain': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },
  '/Script/FactoryGame.FGTrainStationIdentifier': {
    model: '',
    color: 0xff00ff,
    paintable: false
  },

  '/Script/FactoryGame.FGWorldSettings': {
    model: '',
    color: 0xff00ff,
    paintable: false
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
    model: '',
    color: 0xff00ff,
    paintable: false
  }
};

export let modClassNamePrefixes = [
  '/Game/FactoryGame/AreaActions/',
  '/Game/FactoryGame/CrazyMod/',
  '/Game/FactoryGame/FarmingMod/',
  '/Game/FactoryGame/FoundationsIndustrie/',
  '/Game/FactoryGame/HealSpheres/',
  '/Game/FactoryGame/InfiniteStorage/',
  '/Game/FactoryGame/LightItUp/',
  '/Game/FactoryGame/MinerMk4_Mod/',
  '/Game/FactoryGame/Mk6_Mod/',
  '/Game/FactoryGame/MoarFactory_Foundation/',
  '/Game/FactoryGame/MoarFactory_Shape/',
  '/Game/FactoryGame/MoarFactory_Stair/',
  '/Game/FactoryGame/MoarFactory_Wall/',
  '/Game/FactoryGame/MoarFactory/',
  '/Game/FactoryGame/Mod/',
  '/Game/FactoryGame/OilPumpMk2_Mod/',
  '/Game/FactoryGame/PanaMod/',
  '/Game/FactoryGame/RenewablePower/',
  '/Game/FactoryGame/SatisfyingComputers/',
  '/Game/FactoryGame/SKEM/',
  '/Game/FactoryGame/SlowItdown/',
  '/Game/FactoryGame/SolarPanels/',
  '/Game/FactoryGame/sweetTransportal/',
  '/Game/FactoryGame/Teleporter/',
  '/Game/FactoryGame/Unlocks/',
  '/Game/FactoryGame/UtilityMod/',
];

// Well known class names that are used by mods that we don't want to store a modelConfig for
export let modClassNames = [
  '/Game/FactoryGame/AreaActions/Actions/ActionsSettings.ActionsSettings_C',
  '/Game/FactoryGame/AreaActions/Equipment/AreaActions/Equip_AreaActions.Equip_AreaActions_C',
  '/Game/FactoryGame/AreaActions/Tutorial/AreaActionsTutorialSubsystem.AreaActionsTutorialSubsystem_C',
  '/Game/FactoryGame/HealSpheres/Buildable/SuperStormShield.SuperStormShield_C',
  '/Game/FactoryGame/InfiniteStorage/Buildable/InfStorage/Build_InfStorage.Build_InfStorage_C',
  '/Game/FactoryGame/LightItUp/Lamps/CeilingLamp/CeilingLamp.CeilingLamp_C',
  '/Game/FactoryGame/LightItUp/Lamps/ConstructionLight/ConstructionLight.ConstructionLight_C',
  '/Game/FactoryGame/LightItUp/Lamps/LampController.LampController_C',
  '/Game/FactoryGame/LightItUp/Lamps/LampPole/LampPole.LampPole_C',
  '/Game/FactoryGame/LightItUp/Lamps/PowerPoleLight/PowerPoleLight.PowerPoleLight_C',
  '/Game/FactoryGame/LightItUp/Lamps/StreetLamp/StreetLamp.StreetLamp_C',
  '/Game/FactoryGame/LightItUp/Lamps/WallLamp/WallLamp.WallLamp_C',
  '/Game/FactoryGame/LightItUp/Power/LightPowerDistributor/LightPowerDistributor.LightPowerDistributor_C',
  '/Game/FactoryGame/MinerMk4_Mod/MinerMk4.MinerMk4_C',
  '/Game/FactoryGame/Mk6_Mod/Build_BeltMk61.Build_BeltMk61_C',
  '/Game/FactoryGame/Mk6_Mod/Build_ConveyorLiftMk61.Build_ConveyorLiftMk61_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation001.Build_MF_Foundation001_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation002.Build_MF_Foundation002_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation003.Build_MF_Foundation003_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation004.Build_MF_Foundation004_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation005.Build_MF_Foundation005_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation006.Build_MF_Foundation006_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation007.Build_MF_Foundation007_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation008.Build_MF_Foundation008_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation011.Build_MF_Foundation011_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation015.Build_MF_Foundation015_C',
  '/Game/FactoryGame/MoarFactory_Foundation/Buildable/Building/Foundation/Build_MF_Foundation026.Build_MF_Foundation026_C',
  '/Game/FactoryGame/MoarFactory_Stair/Buildable/Building/Stair/Build_MF_Stair001.Build_MF_Stair001_C',
  '/Game/FactoryGame/MoarFactory_Stair/Buildable/Building/Stair/Build_MF_Stair002.Build_MF_Stair002_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall001.Build_MF_Wall001_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall002.Build_MF_Wall002_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall003.Build_MF_Wall003_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall004.Build_MF_Wall004_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall005.Build_MF_Wall005_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall006.Build_MF_Wall006_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall007.Build_MF_Wall007_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall008.Build_MF_Wall008_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall011.Build_MF_Wall011_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall012.Build_MF_Wall012_C',
  '/Game/FactoryGame/MoarFactory_Wall/Buildable/Building/Wall/Build_MF_Wall013.Build_MF_Wall013_C',
  '/Game/FactoryGame/MoarFactory/Buildable/Factory/PowerPlugMk1/Build_MF_PowerPlugMk1.Build_MF_PowerPlugMk1_C',
  '/Game/FactoryGame/MoarFactory/Buildable/Factory/PowerPlugMk2/Build_MF_PowerPlugMk2.Build_MF_PowerPlugMk2_C',
  '/Game/FactoryGame/Mod/Buildable/Factory/InfiniteStorage/Network_InfiniteStorage.Network_InfiniteStorage_C',
  '/Game/FactoryGame/Mod/Buildable/Factory/ItemCounter/Build_ItemCounter.Build_ItemCounter_C',
  '/Game/FactoryGame/Mod/Buildable/Factory/ItemDeleter/Build_ItemDeleter.Build_ItemDeleter_C',
  '/Game/FactoryGame/Mod/Buildable/Factory/MixedSplitter/Build_MixedSplitter.Build_MixedSplitter_C',
  '/Game/FactoryGame/OilPumpMk2_Mod/OilPumpMk2.OilPumpMk2_C',
  '/Game/FactoryGame/PanaMod/Lamps/Lamp1.Lamp1_C',
  '/Game/FactoryGame/PanaMod/Lamps/Lamp2.Lamp2_C',
  '/Game/FactoryGame/RenewablePower/Buildable/Factory/ArcReactorMk1/Build_ArcReactorMk1.Build_ArcReactorMk1_C',
  '/Game/FactoryGame/RenewablePower/Buildable/Factory/WaterTurbine/Build_WaterTurbine.Build_WaterTurbine_C',
  '/Game/FactoryGame/RenewablePower/Buildable/Factory/WaterTurbineMk1/Build_WaterTurbineMk1.Build_WaterTurbineMk1_C',
  '/Game/FactoryGame/RenewablePower/Buildable/Factory/WindTurbine/Build_WindTurbine.Build_WindTurbine_C',
  '/Game/FactoryGame/RenewablePower/Buildable/Factory/WindTurbineMk1/Build_WindTurbineMk1.Build_WindTurbineMk1_C',
  '/Game/FactoryGame/RenewablePower/Buildable/Factory/WindTurbineMk2/Build_WindTurbineMk2.Build_WindTurbineMk2_C',
  '/Game/FactoryGame/SatisfyingComputers/Components/LEDDisplay/LEDDisplay.LEDDisplay_C',
  '/Game/FactoryGame/SatisfyingComputers/Components/PowerController/PowerController.PowerController_C',
  '/Game/FactoryGame/SatisfyingComputers/Components/PowerController/PowerCotrollerPole.PowerCotrollerPole_C',
  '/Game/FactoryGame/SatisfyingComputers/ComputerNetwork/Computer/Computer.Computer_C',
  '/Game/FactoryGame/SatisfyingComputers/ComputerNetwork/NetworkCable/NetworkCable.NetworkCable_C',
  '/Game/FactoryGame/SatisfyingComputers/ComputerNetwork/NetworkPole/NetworkPole.NetworkPole_C',
  '/Game/FactoryGame/SKEM/buildable/Processing/Build_ProcessingFacility.Build_ProcessingFacility_C',
  '/Game/FactoryGame/SolarPanels/Buildable/Factory/Batteries/BatteryController.BatteryController_C',
  '/Game/FactoryGame/SolarPanels/Buildable/Factory/Batteries/Build_BatteryStorage.Build_BatteryStorage_C',
  '/Game/FactoryGame/SolarPanels/Buildable/Factory/SolarPanels/Build_SolarPanelMk1.Build_SolarPanelMk1_C',
  '/Game/FactoryGame/Teleporter/Buildable/EnergyConverter/Build_EnergyConverter.Build_EnergyConverter_C',
  '/Game/FactoryGame/Teleporter/Buildable/Teleporter/Build_Teleporter.Build_Teleporter_C',
  '/Game/FactoryGame/Teleporter/Items/TeleportCore/Desc_TeleportCore.Desc_TeleportCore_C'
];


export function isModClassName(className: string) {
  //return modClassNames.includes(className);
  return modClassNamePrefixes.some((prefix) => className.startsWith(prefix));
}