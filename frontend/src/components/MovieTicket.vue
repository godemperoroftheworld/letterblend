<template>
  <div class="light ticket aspect-70/26 drop-shadow-md drop-shadow-bulb-300/50">
    <div
      class="grid grid-cols-4 size-full bg-bulb-300/75 [mask:url('img/ticket.svg')_no-repeat_center/contain]">
      <div class="relative flex flex-col col-span-1 p-4 px-5">
        <slot name="left" />
      </div>
      <div class="relative flex flex-col col-span-3 p-4 px-5">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
