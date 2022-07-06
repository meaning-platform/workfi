import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'

import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'

const injected = injectedModule()

const infuraKey =  process.env.INFURA_KEY as string
const rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl
    }
  ],
  appMetadata:{
    name: 'meaning.social',
    description: 'A decentralized social network',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" xml:space="preserve"><path fill="#FFF" d="M274 401H1.043V1.105h399.79V401H274m-70.65-270.69c-1.163.281-2.325.563-3.374.69 0 0-.125.154-.034-.605-1.526-4.591-8.913-9.13-15.558-9.36 0 0-.362-.241-.46-.934-2.595-1.532-5.148-3.14-7.793-4.578-4.02-2.185-7.902-4.984-12.215-6.168-4.61-1.265-9.645-1.1-14.505-1.311-14.644-.635-28.87 1.886-42.458 7.105-3.375 1.296-8.711.57-9.956 5.858 0 0 .1.087-.724.005-9.017 1.05-14.23 8.17-20.805 13.095-2.456 1.84-4.704 3.959-6.752 5.7-9.782 18.723-16.265 38.56-15.168 60.529.47.56.94 1.12 1.426 2.615.003 23.347.005 46.694-.587 70.124l-.942 1.23c.519.232 1.037.464 1.665 1.51.303 2.08.949 4.18.827 6.235-.177 3.015 1.007 4.23 4.004 4.745.353.735.707 1.47 1.14 2.937 2.273 6.502 8.568 9.594 13.28 6.782 2.037-1.216 4.463-1.923 6.805-2.452 2.725-.616 5.601-.567 8.322-1.197 3.998-.926 7.748-8.594 6.199-12.639.166-.403.332-.806 1.212-1.398 1.363-5.263 3.835-10.515 3.888-15.792.184-18.553-1.114-37.135-.539-55.665.317-10.197-1.098-20.721 2.765-30.694 2.69-6.944 6.845-12.425 13.669-15.83 1.124-.56 1.506-2.611 2.324-3.872 0 0-.118-.07.744.016 3.715-.321 8.111.517 11.016-1.187 7.88-4.623 14.985 2.534 22.492.547.552-.146 1.458 1.203 2.254 1.78.721.524 1.565 1.404 2.273 1.332 3.877-.395 3.65 2.453 3.985 4.817.154 1.081.026 2.201.026 4.11 4.488-4.405 6.347-4.083 8.67.58.869 1.745 2.208 3.46 2.407 5.29.341 3.13 2.257 2.736 4.132 2.702 0 0 .1-.11.111.344.087.305.267.54.79 1.303.073.425.146.85-.311 1.679.446.925.892 1.85 1.597 3.337.068.404.137.81-.436 1.579.087 1.273.175 2.545.163 4.647-.299 2.118-.88 4.24-.85 6.354.258 18.545.749 37.088.912 55.634.086 9.774-1.054 19.6 1.306 29.165-4.386 1.875-4.38 1.98.6 7.056-2.89 2.928-1.311 4.746 1.705 6.27.988.498 1.842 1.339 2.624 2.15 3.275 3.4 10.18 2.117 13.635-2.444 1.719.021 3.437.042 5.27.832.515.611.972 1.686 1.556 1.76 4.245.54 8.532 1.293 12.773 1.132 2.74-.105 4.154-2.294 2.853-5.779-2.006.94-3.718 2.23-5.558 2.454-1.502.182-3.158-.91-4.1-1.537.447-.649.894-1.298 1.825-2.29.816-.552 1.632-1.105 3.22-1.62 4.08-1.75 7.922-11.489 6.284-16.938.088-25.342.176-50.684.641-76.354-.125-.574-.25-1.147-.548-2.262-.093-.165-.186-.33-.107-1.127.067-.43.134-.86.524-1.479.051-.113.177-.269.142-.33-.119-.203-.296-.372-.61-.492 0 0-.165.04.09-.666.12-.74.24-1.478.97-2.454.296-1.97.592-3.941.908-6.642.12-.72.241-1.439 1.08-2.215l4.355-4.262 2.806.804c-2.006-5.619.727-8.742 4.876-9.909 3.17-.89 3.71-2.34 3.56-5.02 0 0 .069-.067.843.21 2.536-1.518 5.072-3.036 8.208-4.758.416-.073.832-.146 1.67.327 2.226-.754 4.451-1.509 7.567-2.396 2.997.04 5.994.08 9.18.82 5.3 2.317 10.583 4.674 15.927 6.885.46.19 1.32-.586 2.57-.769.441.373.882.746 1.35 1.85 1.38 2.385 2.243 5.412 4.246 7.024 4.734 3.812 6.734 8.842 7.814 14.395 1.405 7.224 2.503 14.507 3.826 22.698.094 22.972.189 45.943.088 69.65-.154 1.604-2.53 3.877 1.437 4.641 0 0-.025.384-.256 1.184.622 1.2 1.244 2.401 1.876 4.344 1.452 1.296 2.905 2.591 4.136 3.934 0 0 .226.006.017.744.988 2.687 2.327 4.4 6.01 2.04 1.952.271 3.905.542 6.364 1.243 1.48-.144 2.96-.29 5.18-.586.753-.075 1.504-.15 2.762.385 8.205 1.29 10.505-.455 11.528-9.106 0 0 .216-.39.6-.645.23-.234.34-.515.338-.749 0 0-.044-.084.694-.13 1.106-2.457 3.023-4.868 3.166-7.379.429-7.532.17-15.103.171-22.66.004-17.93.042-35.86-.07-53.79-.009-1.37-1.089-2.732-1.795-4.726.03-.425.06-.85.816-1.496L351 170.341c-2.519.257-4.062.414-5.803-.135-.075-.73-.15-1.459.337-2.669 1.672-5.4 4.612-11.108-3.514-14.092-.372-.137-.563-.786-.824-1.206-2.75-4.432-5.416-8.923-8.318-13.254-.584-.872-2.067-1.142-3.088-1.787 0 0-.101.039.161-.718l1.01-3.8a4273.633 4273.633 0 0 1-10.305-3.928c-.316-.15-.541-.386-.714-1.418-4.614-3.528-5.49-12-13.934-10.53-.5.086-1.102-.782-1.715-.896-5.108-.955-10.23-1.838-16.072-2.806-.717-.114-1.433-.228-2.173-1.045l2.352-4.453c-2.204-.091-3.744.992-5.447 1.669-1.908.758-3.963 1.148-6.746 1.755-1.05-.084-2.102-.168-3.405-.993-5.026-1.334-10.041-2.439-15.672.839-1.367.061-2.735.123-4.62-.41l-10.857-2.503c-1.647 5.61-7.89 8.517-15.864 7.58-1.561 1.649-2.69 2.794-3.763 3.988-1.03 1.147-2.004 2.345-3.346 3.953-.505.206-1.01.41-2.322.548-2.993.912-7.153.178-7.484 5.553-.197.25-.45.41-1.581.423-1.09.013-2.18.026-3.943.304m-75.915-23.328 4.956-.319-.134-.95h-10.571l.027 1.268h5.722z"/><path fill="#FECC07" d="M223.16 191.017c-.066.43-.133.86-.64 1.7-1.105 2.723-2.306 5.031-2.327 7.35-.045 4.954.83 9.916.78 14.87-.183 18.28-.478 36.561-.995 54.835-.114 4.022-.943 8.124-2.098 11.993-1.504 5.04-13.142 11.767-17.785 9.91-3.85-1.538-9.043-.98-11.247-6.043-.405-.93-2.55-1.104-3.979-1.773-.086-.147-.125-.486-.042-.925-.575-4.676-1.647-8.896-1.813-13.151-.523-13.44-.839-26.89-.959-40.34-.053-5.953.6-11.91.856-17.868.365-8.542.776-17.085.921-25.632.052-3.045-.616-6.103-.969-9.514.103-1.31.22-2.26.612-3.316.279-.822.28-1.54.29-2.584.061-.963.115-1.6.529-2.352 1.036-1.022 2.24-1.892 2.309-2.846.767-10.471 9.838-16.277 14.082-24.835 1.88-3.792 7.715-5.405 10.85-8.834 10.395-11.37 25.198-12.899 38.517-17.4 6.045-2.044 13.15-1.356 19.757-1.196 4.684.113 9.374 1.252 13.999 2.231 6.186 1.31 12.31 2.913 18.47 4.347.187.043.487-.396 1.021-.587.778.294 1.269.564 1.781 1.185 4.981 3.828 10.532 6.715 14.748 10.934 5.164 5.169 9.194 11.467 13.744 17.253 7.22 9.18 10.128 19.79 10.487 31.273.098 3.146.13 6.324.623 9.418.428 2.692-.54 3.865-3.04 3.875-10.5.043-21.003.161-31.493-.16-1.426-.043-3.822-2.276-4.01-3.724-2.273-17.47-10.211-30.712-27.7-36.096-6.32-1.946-13.378-2.777-19.95-2.252-6.028.48-12.015 3.101-17.694 5.54-2.235.96-3.586 3.982-5.383 6.072-.044.007-.132.024-.489-.071-8.538 5.363-11.82 13.758-13.728 22.821-.307 1.46 1.061 3.271 1.656 4.92 0 0 .166-.039.154.197.044.416.1.595.156.775z"/><path fill="#08A7A1" d="M184.022 120.794s.362.24.759.563c5.288 3.48 10.18 6.638 15.07 9.797 0 0 .125-.155.183.205.836 1.007 1.615 1.654 2.308 2.668-8.572 10.028-15.956 20.34-19.6 33.27-1.005 3.067-1.668 5.901-2.624 8.632-.215.616-1.452.874-2.401 1.17-.183-.127-.611-.246-.611-.246s-.101.109-.045-.29c-8.717-21.815-37.19-31.233-58.173-19.659 0 0 .118.071-.283.046-14.436 7.01-19.623 19.358-21.077 34.216-.312.465-.419.784-.622 1.253-.251.336-.441.474-1.16.568-13.504-.011-26.515-.027-39.584-.483.31-18.217 4.085-34.957 14.81-49.61 6.906-9.438 16.316-15.853 26.126-21.8 0 0-.101-.087.31-.062 18.226-8.21 36.766-13.567 56.44-9.815 10.293 1.962 20.13 6.308 30.174 9.577z"/><path fill="#EFCD4A" d="M235.456 162.368c1.753-2.083 3.104-5.105 5.34-6.065 5.678-2.439 11.665-5.06 17.693-5.54 6.572-.525 13.63.306 19.95 2.252 17.489 5.384 25.427 18.626 27.7 36.096.188 1.448 2.584 3.681 4.01 3.725 10.49.32 20.993.202 31.492.16 2.501-.011 3.47-1.184 3.04-3.876-.492-3.094-.524-6.272-.622-9.418-.359-11.484-3.267-22.092-10.487-31.273-4.55-5.786-8.58-12.084-13.744-17.253-4.216-4.22-9.767-7.106-14.38-10.902 5.074 2.377 9.803 5.073 14.532 7.77.135.322.36.558 1.007 1.122 3.12 2.967 5.911 5.519 8.702 8.07 0 0 .101-.038.141.337 7.512 9.174 11.706 19.62 15.141 30.445.076.73.151 1.458.26 2.946.678 7.866 1.322 14.975 1.966 22.085-.03.424-.06.848-.12 2.052-.045 20.065.161 39.353-.17 58.633-.167 9.738-1.308 19.46-2.009 29.189 0 0 .044.084-.183.137-.482.303-.572.603-.495.952 0 0-.216.389-.566.777-4.128 2.962-7.906 5.534-11.684 8.107-.752.075-1.503.15-3.034.227-2.155.052-3.532.103-4.909.154-1.952-.27-3.905-.54-6.265-.994-.41-.182-.567-.315-.655-.627-.768-.64-1.446-.968-2.451-1.404-.98-.261-1.634-.413-2.288-.565 0 0-.225-.006-.045-.312.16-.702.14-1.098.503-1.46 1.706.14 3.367-.228 4.297.433 5.585 3.966 10.79 3.725 17.192 1.096 5.88-2.416 8.05-7.163 9.393-11.777 1.623-5.58 1.24-11.816 1.28-17.77.125-19.578.012-39.156.08-58.734.015-4.098-1.393-7.03-5.766-7.123-9.157-.195-18.323-.172-27.48-.014-4.45.077-6.37 2.983-5.809 7.305.814 6.267 1.756 12.566 1.86 18.865.263 15.904.028 31.816.16 47.724.017 2.153.99 4.297 1.76 7.422-2.772 2.448-1.69 5.685 1.332 8.927.588.632.599 1.803.575 2.634-1.117-.695-1.932-1.3-2.824-2.216-.888-1.57-1.701-2.827-2.514-4.084 0 0 .025-.384-.063-.936-.444-1.976-.799-3.4-1.154-4.825-.094-22.971-.189-45.942-.237-69.838.052-4.067.23-7.221.034-10.352-.828-13.315-4.427-25.354-15.994-33.572-.44-.373-.88-.746-1.776-1.483-6.38-2.393-12.306-4.423-18.231-6.452-2.998-.04-5.995-.08-9.821-.134-2.94.612-5.05 1.238-7.16 1.864-.416.073-.832.146-1.91.275-3.215 1.512-5.768 2.968-8.32 4.425 0 0-.069.067-.434.131-2.19.93-4.015 1.796-5.84 2.662z"/><path fill="#E3F9FC" d="M97.732 191.02c1.25-14.712 6.437-27.06 20.827-34.12-.371 1.336-.753 3.387-1.877 3.948-6.824 3.404-10.98 8.885-13.669 15.829-3.863 9.973-2.448 20.497-2.765 30.694-.575 18.53.723 37.112.539 55.665-.053 5.276-2.525 10.529-4.267 15.466-.058-3.45.518-6.573.547-9.701.235-25.562.368-51.125.65-76.95.084-.452.05-.641.015-.83z"/><path fill="#EFCD4A" d="M182.976 167.026c3.41-12.66 10.794-22.97 19.595-32.932.72-.479 1.125-.657 1.849-.927 1.443-1.094 2.568-2.099 3.694-3.103.31-.071.563-.232 1.217-.74 2.916-1.914 5.375-3.57 7.834-5.226.505-.205 1.01-.41 2.045-.865 1.688-.874 2.785-1.677 4.013-2.097 9.92-3.4 19.866-6.728 29.804-10.077 1.368-.062 2.736-.124 4.967-.173 5.596-.029 10.328-.07 15.06-.11 1.051.084 2.102.168 3.82.49 3.51.658 6.354 1.076 9.197 1.494.717.114 1.433.228 2.755.635a1585.4 1585.4 0 0 0 14.186 5.639c-.247.214-.547.653-.734.61-6.16-1.434-12.284-3.038-18.47-4.347-4.625-.979-9.315-2.118-13.999-2.231-6.607-.16-13.712-.848-19.757 1.196-13.319 4.501-28.122 6.03-38.517 17.4-3.135 3.43-8.97 5.042-10.85 8.834-4.244 8.558-13.315 14.364-14.082 24.835-.07.954-1.273 1.824-2.535 2.692-.754-.36-.923-.678-1.092-.997z"/><path fill="#DCFAFA" d="M96.686 121.053c-9.398 5.988-18.808 12.403-25.715 21.84-10.724 14.654-14.498 31.394-14.866 49.87.03.875.059 1.05.007 1.693-.063 24.717-.193 48.97.094 73.217.057 4.84 1.7 9.66 2.646 14.82.447 1.354.861 2.376 1.198 3.467a67.79 67.79 0 0 1-.232.203c-2.874.118-4.058-1.098-3.88-4.113.12-2.055-.525-4.155-.881-6.977a50.137 50.137 0 0 1-.075-2.081c-.003-23.347-.005-46.694-.021-70.808-.327-1.24-.641-1.713-.955-2.185-1.555-21.631 4.928-41.469 14.71-60.192 2.048-1.741 4.296-3.86 6.752-5.7 6.575-4.926 11.788-12.046 21.218-13.054z"/><path fill="#EFCD4A" d="M184.956 284.006c1.342.522 3.487.696 3.892 1.626 2.204 5.062 7.398 4.505 11.247 6.044 4.643 1.856 16.28-4.871 17.785-9.91 1.155-3.87 1.984-7.972 2.098-11.994.517-18.274.812-36.555.995-54.835.05-4.954-.825-9.916-.78-14.87.021-2.319 1.222-4.627 2.241-7.034.447.07.54.236.625 1.01.054 1.065.116 1.523.179 1.981-.088 25.342-.176 50.684-.526 76.746-2.44 5.873-4.617 11.027-6.794 16.18-.816.553-1.632 1.106-3.054 1.85-2.369.83-4.132 1.47-6.26 2.112-1.087.11-1.808.218-2.963.251-2.193-.037-3.951 0-6.023-.037-.741-.107-1.17-.139-1.816-.422-1.087-.38-1.956-.51-3.147-.764-2.782-2.729-5.24-5.331-7.7-7.934z"/><path fill="#DCFAFA" d="M183.973 120.447c-9.994-2.922-19.832-7.268-30.124-9.23-19.675-3.752-38.215 1.605-56.397 9.866.79-5.364 6.126-4.638 9.501-5.934 13.589-5.219 27.814-7.74 42.458-7.105 4.86.21 9.895.046 14.505 1.311 4.313 1.184 8.195 3.983 12.215 6.168 2.645 1.438 5.198 3.046 7.842 4.924z"/><path fill="#FEFDCC" d="M181.048 280.986c-3.12-9.546-1.98-19.373-2.067-29.147-.163-18.546-.654-37.089-.913-55.634-.03-2.114.552-4.236 1.133-6.79.282-.435.74-.525.852-.245.206.672.301 1.063.322 1.906.133 6.257.49 12.062.517 17.868.081 17.298-.138 34.6.12 51.895.1 6.746 1.16 13.478 1.492 20.207-.68-.027-1.068-.044-1.456-.06z"/><path fill="#E3F9FC" d="M119.319 156.948c20.552-11.618 49.025-2.2 57.81 19.584-2 .464-3.915.858-4.256-2.272-.2-1.83-1.538-3.545-2.407-5.29-2.323-4.663-4.182-4.985-8.67-.58 0-1.909.128-3.029-.026-4.11-.335-2.364-.108-5.212-3.985-4.817-.708.072-1.552-.808-2.273-1.331-.796-.578-1.702-1.927-2.254-1.781-7.507 1.987-14.613-5.17-22.492-.547-2.905 1.704-7.3.866-11.447 1.144z"/><path fill="#1F75A5" d="M97.6 192.114c-.165 25.562-.298 51.125-.533 76.687-.029 3.128-.605 6.25-.905 9.796-.143.823-.31 1.226-.732 2.219-2.665 7.186-7.155 11.117-14.261 11.226.39-.748.614-1.304 1.014-1.498 6.573-3.188 12.894-6.513 10.902-15.676-.083-.38.326-1.241.552-1.258 3.623-.269 2.309-3.023 2.315-4.839.071-19.613.04-39.227.044-58.841.004-14.937.008-14.86-15.265-14.985-5.225-.043-10.446-.58-15.205-.92 8.18-.039 15.9.028 23.614-.1 2.371-.04 4.733-.614 7.1-.943.225-.09.415-.227.815-.603a1.7 1.7 0 0 1 .544-.265z"/><path fill="#FDFBD8" d="M345.267 282.9c.332-9.706 1.473-19.428 1.64-29.166.331-19.28.125-38.568.233-58.318.674.9 1.754 2.262 1.763 3.631.112 17.93.074 35.861.07 53.792-.002 7.556.258 15.127-.171 22.659-.143 2.511-2.06 4.922-3.535 7.402z"/><path fill="#FBFEF5" d="M180.668 280.995c.768.007 1.156.024 1.978.332a29.999 29.999 0 0 1 2.098 2.046s.039.34.125.486c2.546 2.75 5.004 5.352 7.838 8.4 1.355.529 2.334.613 3.314.696.428.032.856.064 1.611.388.328.292.36.728.36.728-2.597 4.526-9.501 5.808-12.776 2.41-.782-.812-1.636-1.653-2.624-2.152-3.016-1.523-4.595-3.341-1.704-6.27-4.981-5.075-4.987-5.18-.22-7.064z"/><path fill="#E3F9FC" d="M81.084 292.403c7.19-.47 11.68-4.401 14.283-11.266 1.869 3.134-1.88 10.802-5.88 11.728-2.72.63-5.596.581-8.321 1.197-2.342.53-4.768 1.236-6.805 2.452-4.712 2.812-11.007-.28-13.113-7.238.435-.623.623-.853.995-1.066.723.36 1.183.638 1.656.907.011-.009.005-.035.187.275 5.081 1.331 9.979 2.352 15.155 3.421.799-.104 1.32-.257 1.843-.41z"/><path fill="#FDFBD8" d="M345.253 167.778c-3.717-10.586-7.911-21.03-15.447-30.156 1.005.22 2.488.49 3.072 1.363 2.902 4.331 5.567 8.822 8.318 13.254.26.42.452 1.069.824 1.206 8.126 2.984 5.186 8.692 3.233 14.333zM252.769 110.761c-9.68 3.647-19.626 6.975-29.546 10.375-1.228.42-2.325 1.223-3.841 1.881.64-1.143 1.614-2.34 2.644-3.488 1.074-1.194 2.202-2.34 3.763-3.989 7.974.938 14.217-1.968 15.864-7.579 3.648.841 7.253 1.672 11.116 2.8zM303.3 119.057c-4.815-1.805-9.342-3.587-14.112-5.63 4.875.643 9.997 1.526 15.105 2.48.613.115 1.214.983 1.715.896 8.445-1.469 9.32 7.003 13.953 10.886-4.71-2.342-9.44-5.038-14.535-7.766-.858-.302-1.349-.572-2.127-.866z"/><path fill="#FEFACC" d="M288.962 161.446c11.553 7.852 15.152 19.89 15.98 33.206.195 3.13.018 6.285-.08 9.886-1.323-6.8-2.421-14.084-3.826-21.308-1.08-5.553-3.08-10.583-7.814-14.395-2.003-1.612-2.865-4.64-4.26-7.39z"/><path fill="#FDFBD8" d="M347.56 192.937c-1.007-6.998-1.651-14.107-2.23-21.62 1.608-.562 3.151-.72 5.67-.976-.96 7.021-2.018 14.753-3.44 22.596z"/><path fill="#FEFACC" d="M235.412 162.375c1.87-.873 3.694-1.74 5.842-2.646.556 2.594.017 4.042-3.153 4.933-4.149 1.167-6.882 4.29-4.876 9.909l-2.806-.804c-1.615 1.58-2.985 2.921-4.705 3.945 2.955-5.315 6.26-10.314 9.566-15.313l.132-.024z"/><path fill="#EFCD4A" d="M234.923 162.304c-2.948 5.094-6.254 10.093-9.568 15.437a16.382 16.382 0 0 1-.644 3.111c-.596 2.496-.92 4.383-1.244 6.27a37.86 37.86 0 0 1-.489 2.57c-.722-1.296-2.09-3.108-1.783-4.567 1.908-9.063 5.19-17.458 13.728-22.821z"/><path fill="#FBFEF5" d="M204.075 293.237c.721-.107 1.442-.214 2.71-.053 1.77.117 2.992-.035 4.214-.186 1.588.527 3.244 1.619 4.746 1.437 1.84-.224 3.552-1.513 5.558-2.454 1.3 3.485-.113 5.674-2.853 5.779-4.241.161-8.528-.592-12.773-1.132-.584-.074-1.04-1.149-1.595-2.36-.039-.6-.007-1.03-.007-1.03z"/><path fill="#6BA96A" d="M180.449 190.625a23.86 23.86 0 0 1-.366-1.798c-.283-1.746-.485-2.867-.686-3.988-.068-.405-.137-.81-.297-1.837-.387-1.455-.68-2.286-.974-3.118-.074-.425-.147-.85-.276-1.769-.056-.493.05-.89.05-.89.766-.422 2.003-.68 2.218-1.296.956-2.73 1.62-5.565 2.623-8.632.404.048.573.366.968.84.171.791.117 1.43-.149 2.638a15.675 15.675 0 0 0-.361 2.443c-.117.95-.233 1.9-.596 3.538-.882 5.08-1.518 9.475-2.154 13.869z"/><path fill="#DCFAFA" d="M199.897 130.774c-4.937-2.779-9.828-5.937-14.901-9.385 6.033-.124 13.42 4.415 14.9 9.385z"/><path fill="#FDFBD8" d="M332.223 293.202c3.525-2.879 7.303-5.451 11.379-8.196-.621 8.046-2.92 9.792-11.379 8.196z"/><path fill="#FEFACC" d="M269.035 153.494c5.831 1.68 11.757 3.71 17.849 6.031-.508.62-1.368 1.395-1.828 1.205-5.344-2.211-10.627-4.568-16.021-7.236z"/><path fill="#FDFBD8" d="M286.06 112.409c-2.832-.067-5.675-.485-8.79-1.171 1.72-.817 3.775-1.207 5.683-1.965 1.703-.677 3.243-1.76 5.447-1.669-.784 1.484-1.568 2.968-2.34 4.805z"/><path fill="#FEFACC" d="M216.304 288.97c1.791-5.173 3.969-10.327 6.423-15.733 1.885 4.262-1.957 14-6.423 15.732z"/><path fill="#FDFBD8" d="M272.928 110.406c-4.606.41-9.338.451-14.532.391 4.365-3.201 9.38-2.096 14.532-.391zM329.82 136.858c-2.922-2.173-5.712-4.725-8.602-7.599 3.07.884 6.239 2.088 9.743 3.42a223.417 223.417 0 0 1-1.141 4.18z"/><path fill="#DCFAFA" d="M127.001 106.981h-5.288l-.027-1.268h10.57l.135.95c-1.652.106-3.304.213-5.39.318z"/><path fill="#FDFBD8" d="M216.761 124.064c-2.055 1.69-4.514 3.346-7.318 5.06-.238-4.916 3.922-4.182 7.318-5.06z"/><path fill="#FEFACC" d="M242.117 159.713c2.165-1.595 4.718-3.051 7.633-4.462-2.174 1.565-4.71 3.083-7.633 4.462zM252.17 155.148c1.9-.9 4.01-1.525 6.505-2.07a30.038 30.038 0 0 1-6.504 2.07z"/><path fill="#FDFBD8" d="M308.952 285a73.124 73.124 0 0 1 2.799 2.155c.466.47.579.598.692.727.02.395.04.791-.01 1.47-1.521-1.014-2.974-2.31-4.192-3.978.234-.373.71-.374.71-.374zM312.264 290.056c.758-.217 1.412-.065 2.468.491 1.089.743 1.776 1.082 2.463 1.42 0 0 .158.134.159.233-2.867 2.625-4.206.912-5.09-2.144z"/><path fill="#FEFACC" d="M223.771 187.004c.02-1.769.344-3.656.93-5.786-.033 1.727-.329 3.697-.93 5.786zM211.322 292.948c-1.545.201-2.767.353-4.171.233 1.58-.911 3.344-1.55 5.471-2.21-.083.629-.53 1.278-1.3 1.977z"/><path fill="#DCFAFA" d="M204.101 133.258c-.405.179-.81.357-1.444.469a17.454 17.454 0 0 1-2.68-2.29c1.048-.564 2.21-.846 3.705-.86.36 1.072.39 1.876.42 2.681z"/><path fill="#FDFBD8" d="M204.42 133.167c-.348-.714-.377-1.518-.402-2.722 1.094-.413 2.185-.426 3.685-.41-.715 1.033-1.84 2.038-3.283 3.132z"/><path fill="#FEFACC" d="M305.047 275.21c.453 1.057.808 2.48 1.178 4.28-3.805-.035-1.43-2.308-1.178-4.28zM308.876 284.687c.076.313-.401.314-.64.316-.86-1.199-1.483-2.4-1.99-4 .929.857 1.742 2.114 2.63 3.684z"/><path fill="#E3F9FC" d="M179.076 185.021c.522.94.724 2.06.895 3.525-.03.344-.488.434-.72.455a9.518 9.518 0 0 1-.175-3.98z"/><path fill="#FEFACC" d="M203.64 293.163c.435.074.403.504.385.72-1.737.195-3.455.174-5.603.17-.43.018-.462-.418-.476-.635 1.744-.255 3.502-.292 5.695-.255z"/><path fill="#E3F9FC" d="M177.86 180.086c.56.63.853 1.461 1.11 2.635-.483-.583-.93-1.508-1.11-2.635z"/><path fill="#DCFAFA" d="M61.98 288.128c-.11.295-.297.525-.771.782-.561-.645-.915-1.38-1.33-2.43-.06-.317.094-.452.434-.382.783.723 1.225 1.377 1.667 2.03z"/><path fill="#FDFBD8" d="M324.28 293.493c1.124-.267 2.501-.318 4.286-.294-1.072.22-2.552.365-4.286.294z"/><path fill="#F4FFFE" d="M53.777 200.167c.543.304.857.777 1.176 1.549-.465-.26-.935-.82-1.176-1.549zM54.685 273.033c.304.405.311.851.317 1.632-.52.104-1.038-.128-1.557-.36.314-.41.628-.82 1.24-1.272z"/><path fill="#FEFACC" d="M223.426 195.86c-.25-.294-.313-.752-.28-1.547.22.236.344.81.28 1.547z"/><path fill="#E3F9FC" d="M177.717 177.099c.183.126.077.523.008.716-.342.03-.522-.204-.614-.736-.005-.226.423-.107.606.02z"/><path fill="#FDFBD8" d="M344.412 283.884c-.269-.221-.18-.52.298-.87.233.227.124.508-.298.87z"/><path fill="#FEFACC" d="M223.322 190.923c-.217-.086-.273-.265-.237-.712.245-.085.422.084.54.286.036.062-.09.218-.303.426z"/><path fill="#EFCD4A" d="M180.375 191.076c.71-4.845 1.346-9.24 2.242-13.96.6 2.724 1.267 5.782 1.215 8.827-.145 8.547-.556 17.09-.921 25.632-.255 5.959-.91 11.915-.856 17.868.12 13.45.436 26.9.96 40.34.165 4.255 1.237 8.475 1.812 13.151-.638-.145-1.192-.73-1.89-1.596-.765-7.02-1.825-13.753-1.925-20.5-.258-17.294-.039-34.596-.12-51.894-.027-5.806-.384-11.61-.517-17.868zM183.475 173.113c-.226-.519-.176-1.143.078-2.013.203.472.201 1.19-.078 2.013z"/><path fill="#4DB7D1" d="M95.746 192.987c-1.873.324-4.235.899-6.606.938-7.715.128-15.433.061-23.965.075-1.28.026-1.746.046-2.637.036a491.875 491.875 0 0 0-6.345-.047c-.03-.175-.058-.35-.03-.786 13.068-.243 26.079-.227 39.583-.216zM97.717 191.85c-.118.264-.416.34-.565.38-.043-.28.064-.6.376-1.064.239.044.273.233.19.685z"/><path fill="#FBB618" d="M312.826 287.915c-.496-.162-.61-.29-.774-.67-.328-1.173-.339-2.344-.927-2.976-3.022-3.242-4.104-6.48-1.332-8.927-.77-3.125-1.743-5.27-1.76-7.422-.132-15.908.103-31.82-.16-47.724-.104-6.299-1.046-12.598-1.86-18.865-.562-4.322 1.36-7.228 5.808-7.305 9.158-.158 18.324-.181 27.48.014 4.374.093 5.782 3.025 5.767 7.123-.068 19.578.045 39.156-.08 58.733-.04 5.955.343 12.191-1.28 17.771-1.343 4.614-3.512 9.361-9.393 11.777-6.402 2.63-11.607 2.87-17.192-1.096-.93-.66-2.59-.293-4.297-.433z"/><path fill="#FEFACC" d="M317.107 291.656c-.6-.027-1.286-.366-2.05-1 .604.032 1.282.36 2.05 1z"/><path fill="#1F75A5" d="M56.112 194.456c2.054-.461 4.028-.456 6.43-.071.041 1-.481 2.208-.71 2.155-4.107-.954-3.869 1.833-3.833 4.371.373 26.985.765 53.969 1.07 81.027l-.25.224c-.912-4.83-2.556-9.65-2.613-14.49-.287-24.246-.157-48.499-.094-73.216zM62.243 288.21c-.705-.735-1.147-1.389-1.853-2.18-.677-1.16-1.09-2.183-1.538-3.536-.033-.332.133-.48.537-.445 2.714 1.834 5.412 3.406 4.498 7.077-.46-.278-.921-.557-1.644-.916z"/><path fill="#FEFACC" d="M195.802 292.704c-.76.168-1.74.084-2.772-.32.816-.19 1.685-.06 2.772.32z"/><path fill="#0175BB" d="M63.899 289.117c.902-3.662-1.796-5.234-4.427-7.142-.708-27.095-1.1-54.08-1.473-81.064-.036-2.538-.274-5.325 3.833-4.371.229.053.751-1.155 1.134-2.125.463-.369.929-.389 1.746-.385 5.573.336 10.794.872 16.02.915 15.272.125 15.268.048 15.264 14.985-.005 19.614.027 39.228-.044 58.841-.006 1.816 1.308 4.57-2.315 4.839-.226.017-.635.878-.552 1.258 1.992 9.163-4.329 12.488-10.902 15.676-.4.194-.624.75-1.014 1.498-.607.514-1.129.667-2.2.541-5.389-1.353-10.227-2.427-15.065-3.501 0 0 .006.026-.005.035z"/><path fill="#1F75A5" d="M64.086 289.392c4.656.764 9.494 1.838 14.605 3.142a171.894 171.894 0 0 1-14.605-3.142z"/></svg>',
    

  }
})



import Layout from '../components/Layout'



function MyApp({ Component, pageProps }: AppProps) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  // create an ethers provider
  let ethersProvider

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
  }
  return (
    <div>
      <NextHead>
        <title>WorkFi</title>
      </NextHead>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}
export default MyApp
