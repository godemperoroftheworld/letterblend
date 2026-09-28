<template>
  <div class="drop-shadow-ticket/25 relative aspect-26/40 drop-shadow-lg xl:aspect-70/26">
    <div
      class="light bg-ticket grid size-full grid-flow-row grid-cols-none grid-rows-4 mask-[url(/img/ticket-vertical.svg)] mask-contain mask-no-repeat xl:grid-flow-col xl:grid-cols-4 xl:grid-rows-none xl:mask-[url(/img/ticket.svg)]">
      <div class="relative col-span-1 row-span-1 p-4 px-5">
        <slot name="left" />
      </div>
      <div class="relative col-span-1 row-span-3 p-4 px-5 xl:col-span-3 xl:row-span-1">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
