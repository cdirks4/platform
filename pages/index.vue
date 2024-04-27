<script>
import {
  AppConfig,
  UserSession,
  showConnect,
  openSTXTransfer,
  openContractCall,
} from "@stacks/connect";
import { makeContractCall, broadcastTransaction } from "@stacks/transactions";
import { ref, onMounted } from "vue";

import { StacksTestnet, StacksDevnet } from "@stacks/network";
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
} from "@stacks/transactions";

export default {
  name: "App",
  setup() {
    const appConfig = new AppConfig(
      ["store_write", "publish_data"],
      "http://localhost:3999"
    );

    const userSession = new UserSession({ appConfig });
    const authOptions = {
      appDetails: {
        name: "Hello Stacks",
        icon: "http://localhost:3000/favicon.ico",
      },
      redirectTo: "/",
      manifestPath: "/manifest.json",
      onFinish: (param) => {
        console.log("finished login", { param });
        userData.value = userSession.loadUserData();
      },
      onCancel: (param) => {
        console.log("cancelled login", { param });
      },
    };
    const connectWallet = () => {
      showConnect(authOptions);
    };
    const userTransactionRef = ref(null);
    const testDeposit = async () => {
      const test = await openContractCall({
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "lagoon",
        functionName: "deposit",
        functionArgs: [uintCV(2000)],
        onFinish: (data) => {
          console.log(data);
          console.log(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`
          );
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
        onCancel: () => {
          console.log("cancel");
        },
      });
      console.log(test);
    };
    const testTransfer = async () => {
      const test = await openSTXTransfer({
        recipient: "ST1TZ0M4XTA1EHX5Z97Q69RP7PC8QAEMK95WCZXDF",
        amount: "10",
        memo: "Tester",
        network: new StacksDevnet(),
        onFinish: (data) => {
          console.log(data);
          console.log(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`
          );
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
      });

      // const explorerTransactionUrl =
      // console.log("View transaction in explorer:", explorerTransactionUrl);
    };
    const userData = ref(null);

    onMounted(() => {
      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then((data) => {
          userData.value = data;
          delete userData.value.authResponseToken;
          delete userData.value.gaiaAssociationToken;
        });
      } else if (userSession.isUserSignedIn()) {
        userData.value = userSession.loadUserData();
        delete userData.value.authResponseToken;
        delete userData.value.gaiaAssociationToken;
      }
    });
    return {
      testDeposit,
      testTransfer,
      connectWallet,
      userTransactionRef,
      userData,
      elevationData: [],
      chartOptions: {
        chart: {
          type: "area",
          zoomType: "x",
          panning: true,
          panKey: "shift",
          scrollablePlotArea: {
            minWidth: 600,
          },
        },

        caption: {
          text: "This chart uses the Highcharts Annotations feature to place labels at various points of interest. The labels are responsive and will be hidden to avoid overlap on small screens.",
        },

        title: {
          text: "sBTC price",
          align: "center",
        },

        accessibility: {
          description:
            "This line chart uses the Highcharts Annotations feature to place labels at various points of interest. The labels are responsive and will be hidden to avoid overlap on small screens. Image description: An annotated line chart illustrates the 8th stage of the 2017 Tour de France cycling race from the start point in Dole to the finish line at Station des Rousses. Altitude is plotted on the Y-axis, and distance is plotted on the X-axis. The line graph is interactive, and the user can trace the altitude level along the stage. The graph is shaded below the data line to visualize the mountainous altitudes encountered on the 187.5-kilometre stage. The three largest climbs are highlighted at Col de la Joux, Côte de Viry and the final 11.7-kilometer, 6.4% gradient climb to Montée de la Combe de Laisia Les Molunes which peaks at 1200 meters above sea level. The stage passes through the villages of Arbois, Montrond, Bonlieu, Chassal and Saint-Claude along the route.",
          landmarkVerbosity: "one",
        },

        lang: {
          accessibility: {
            screenReaderSection: {
              annotations: {
                descriptionNoPoints:
                  "{annotationText}, at distance {annotation.options.point.x}km, elevation {annotation.options.point.y} meters.",
              },
            },
          },
        },

        credits: {
          enabled: false,
        },

        annotations: [
          {
            draggable: "",
            labelOptions: {
              backgroundColor: "rgba(255,255,255,0.5)",
              verticalAlign: "top",
              y: 15,
            },
            labels: [
              {
                point: {
                  xAxis: 0,
                  yAxis: 0,
                  x: 27.98,
                  y: 255,
                },
                text: "Arbois",
              },
              {
                point: {
                  xAxis: 0,
                  yAxis: 0,
                  x: 45.5,
                  y: 611,
                },
                text: "Montrond",
              },
              {
                point: {
                  xAxis: 0,
                  yAxis: 0,
                  x: 63,
                  y: 651,
                },
                text: "Mont-sur-Monnet",
              },
              {
                point: {
                  xAxis: 0,
                  yAxis: 0,
                  x: 84,
                  y: 789,
                },
                x: -10,
                text: "Bonlieu",
              },
              {
                point: {
                  xAxis: 0,
                  yAxis: 0,
                  x: 129.5,
                  y: 382,
                },
                text: "Chassal",
              },
              {
                point: {
                  xAxis: 0,
                  yAxis: 0,
                  x: 159,
                  y: 443,
                },
                text: "Saint-Claude",
              },
            ],
          },
        ],

        xAxis: {
          labels: {
            format: "{value} km",
          },
          minRange: 5,
          title: {
            text: "Distance",
          },
          accessibility: {
            rangeDescription: "Range: 0 to 187.8km.",
          },
        },

        yAxis: {
          startOnTick: true,
          endOnTick: false,
          maxPadding: 0.35,
          title: {
            text: null,
          },
          labels: {
            format: "{value} m",
          },
          accessibility: {
            description: "Elevation",
            rangeDescription: "Range: 0 to 1,553 meters",
          },
        },

        tooltip: {
          headerFormat: "Distance: {point.x:.1f} km<br>",
          pointFormat: "{point.y} m a. s. l.",
          shared: true,
        },

        legend: {
          enabled: false,
        },

        series: [
          {
            data: [],
            fillOpacity: 0.5,
            name: "Elevation",
            marker: {
              enabled: false,
            },
            threshold: null,
          },
        ],
      },
    };
  },
};
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen gap-8">
    <h1 class="text-6xl font-black">Hello Stacks</h1>

    <button
      class="w-full bg-[black] text-white rounded-lg py-2 max-w-[80vw] md:max-w-md h-12"
      @click="connectWallet"
    >
      Connect Wallet
    </button>
    <div v-if="userData">
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        class="text-salamander hover:brightness-110 transition-all duration-200 cursor-pointer hover:-rotate-180"
        height="24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M464 208L352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
        ></path>
      </svg>

      <h2 class="text-2xl">User Data</h2>
      <div class="max-w-[80vw]">
        <h6 class="text-xs">{{ userData }}</h6>
      </div>
      <form>
        <input type="text" name="" id="" />
      </form>
      <div>
        <button
          @click="testDeposit"
          class="w-full bg-[black] text-white rounded-lg py-2 max-w-[80vw] md:max-w-md h-12"
        >
          openSTXTransfer
        </button>
        <div v-if="userTransactionRef">
          <NuxtLink :to="userTransactionRef">{{ userTransactionRef }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
