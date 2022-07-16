//// { "compiler": {}, "order": 1}

// 3.7에서는 if문 안에서
// 함수의 반환 값 대신 함수를 잘못 사용하는 것을
// 검사하는 기능이 추가되었습니다.

// 이것은 함수가 존재하는 것을 알고 있으며
// if문을 항상 참으로 할 때만 적용됩니다.

// 선택적인 콜백과, 선택적이지 않은 콜백이 있는
// 플러그인 인터페이스의 예시입니다.

interface PluginSettings {
  pluginShouldLoad?: () => void;
  pluginIsActivated: () => void;
}

declare const plugin: PluginSettings;

// pluginShouldLoad가 존재하지 않을 수 있으므로,
// 다음 검사는 타당합니다.

if (plugin.pluginShouldLoad) {
  // pluginShouldLoad가 존재할 때의 처리.
}

// 이는 3.6 이전에서 에러가 아니었습니다.

if (plugin.pluginIsActivated) {
  // 플러그인이 활성화되었을 때 무언가를 처리하려고 하는데,
  // 메서드를 호출하는 대신
  // 프로퍼티로 사용했습니다.
}

// pluginIsActivated는 언제나 존재하겠지만,
// if 블록 안에서 메서드가 호출되고 있으므로
// TypeScript는 검사를 허용하고 있습니다.

if (plugin.pluginIsActivated) {
  plugin.pluginIsActivated();
}
