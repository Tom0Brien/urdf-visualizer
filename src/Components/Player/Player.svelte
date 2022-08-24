<script lang="ts">
  import type { JointInfo } from "../../types";
  export let jointInfos: JointInfo[];

  import * as test_json from "./test.json";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Frame rate
  var play_icon = "../icons/play.svg";
  var pause_icon = "../icons/pause.svg";
  var button_src = play_icon;
  var playing = false;
  var current_frame = 0;

  var frame_rate = 60;
  var max_frame = Object.keys(test_json["default"]).length - 1;
  var min_frame = 0;
  var max_time = max_frame / frame_rate;

  console.log(max_frame);

  function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  var total_time = fancyTimeFormat(max_time);

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

<div class="navbar bg-base-300 w-full">
  <div class="flex items-center justify-center align-middle w-full">
    <ul class="menu menu-horizontal rounded-box mr-4">
      <li>
        <button on:click={playAnimation}>
          {#if playing}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><rect x="6" y="4" width="4" height="16" /><rect
                x="14"
                y="4"
                width="4"
                height="16"
              /></svg
            >
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><polygon points="5 3 19 12 5 21 5 3" /></svg
            >
          {/if}
        </button>
      </li>
      <li>
        <button on:click={stopAnimation}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg
          >
        </button>
      </li>
    </ul>

    <div class="mr-4">{fancyTimeFormat(current_frame / frame_rate)}</div>
    <input
      class="range range-sm mr-4 w-96"
      type="range"
      min={min_frame}
      max={max_frame}
      bind:value={current_frame}
      on:input={(e) => updateFrame(current_frame)}
    />

    <div>{total_time}</div>
  </div>
  <div>
    <ul class="menu menu-horizontal w-64 ">
      <li>
        <button
          ><span>URDF</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-upload"
            ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
              points="17 8 12 3 7 8"
            /><line x1="12" y1="3" x2="12" y2="15" /></svg
          ></button
        >
      </li>
      <li>
        <button
          ><span>Animation</span><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-upload"
            ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
              points="17 8 12 3 7 8"
            /><line x1="12" y1="3" x2="12" y2="15" /></svg
          ></button
        >
      </li>
    </ul>
  </div>
</div>
