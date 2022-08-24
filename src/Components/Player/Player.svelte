<script lang="ts">
  import type { JointInfo } from "../../types";
  export let jointInfos: JointInfo[];

  import * as test_json from "./test.json";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Frame rate
  var frame_rate = 60;
  var play_icon = "../icons/play.svg";
  var pause_icon = "../icons/pause.svg";
  var button_src = play_icon;
  var playing = false;
  var current_frame = 0;

  var max_frame = Object.keys(test_json["default"]).length - 1;
  var min_frame = 0;

  console.log(max_frame);

  function updateFrame(current_frame_idx) {
    const joint_set = test_json["default"][current_frame.toString()];
    for (var j = 0; j < Object.keys(joint_set).length; j++) {
      for (var k = 0; k < jointInfos.length; k++) {
        if (jointInfos[k].name == Object.keys(joint_set)[j]) {
          jointInfos[k].degree =
            (joint_set[Object.keys(joint_set)[j]][0] * 180) / Math.PI;
        }
      }
    }
  }

  async function playAnimation() {
    if (playing) {
      console.log("Stopping animation");
      playing = false;
      return;
    }

    playing = true;
    for (
      current_frame;
      current_frame < Object.keys(test_json["default"]).length;
      current_frame++
    ) {
      // Pause
      if (!playing) {
        button_src = play_icon;
        break;
      }
      // Change icon to pause
      button_src = pause_icon;

      // Update the frames
      updateFrame(current_frame);

      // Delay between frames
      await sleep((1 / frame_rate) * 1000);
    }
    // Reset the animation
    if (playing) {
      current_frame = 0;
      button_src = play_icon;
      playing = false;
    }
  }

  function stopAnimation() {
    // Set playing state to false and reset the frame counter
    playing = false;
    current_frame = 0;
    // Reset the robot joints to initial frame
    const joint_set = test_json["default"][current_frame.toString()];
    for (var k = 0; k < jointInfos.length; k++) {
      if (jointInfos[k].name == Object.keys(joint_set)[0]) {
        jointInfos[k].degree =
          (joint_set[Object.keys(joint_set)[0]][0] * 180) / Math.PI;
      }
    }
  }
</script>

<div class="flex content-center items-center h-16 px-16">
  <div class="flex h-16 justify-center py-4 ml-96">
    <button on:click={playAnimation} class="mr-4">
      <img src={button_src} class="w-8 h-8 mr-8" />
    </button>

    <button on:click={stopAnimation}>
      <img src="../icons/square.svg" class="w-8 h-8 mr-16" />
    </button>

    <input
      class="mr-4 w-96"
      type="range"
      min={min_frame}
      max={max_frame}
      bind:value={current_frame}
      on:input={(e) => updateFrame(current_frame)}
    />

    <span>
      {current_frame} / {max_frame}
    </span>
  </div>
</div>
