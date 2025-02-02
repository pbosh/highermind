import { Screen } from '../utils/types';
import { useWllama } from '../utils/wllama.context';
import ScreenWrapper from './ScreenWrapper';

export default function GuideScreen() {
  const { navigateTo } = useWllama();

  return (
    <ScreenWrapper>
      <div className="guide-text pt-16">
        <h1 className="text-2xl font-bold mb-4">HigherMind AI Models v0.1</h1>

        <div className="mb-3">
          HigherMind is providing free AI models for you to use. These models have been meticuously created using the best content from humanities entire written corpus. Eg. Classic books, newer books and philosophical concepts throughout the ages.
          <br /><br />
          *When newer books are concerned we have used concepts from within these books rather than copright content. For clarity no copyrighted content exists within any HigherMind model.
        </div>

        <div className="mb-3">
          Please note that:
          <ul>
            <li>
              Due to WebAssembly overhead, performance will not be as good as
              running llama.cpp in native. Performance degradation can range
              from 25% to 50%.
            </li>
            <li>
              Due to memory constraint of WebAssembly and emscripten, models
              larger than 2GB will need to be split.{' '}
              <a
                href="https://github.com/ngxson/wllama?tab=readme-ov-file#split-model"
                target="_blank"
                rel="noopener"
              >
                Click here to learn more
              </a>
            </li>
            <li>
              Large model may not fit into RAM, (again) due to memory constraint
              of WebAssembly.
            </li>
            <li>Running on smartphone maybe buggy.</li>
            <li>
              <b>WebGPU is not supported</b>. We're still working hard to add
              support for WebGPU.
            </li>
          </ul>
        </div>

        <div className="mb-3">
          To get started, go to{' '}
          <button
            className="btn btn-sm btn-primary btn-outline"
            onClick={() => navigateTo(Screen.MODEL)}
          >
            Manage models
          </button>{' '}
          page to select a model.
        </div>

        <h1 className="text-xl font-bold mb-4 mt-6">Reporting bugs</h1>

        <div className="mb-3">
          Wllama is in development and many bugs are expected to happen. If you
          find a bug, please{' '}
          <a
            href="https://github.com/ngxson/wllama/issues"
            target="_blank"
            rel="noopener"
          >
            open a issue
          </a>{' '}
          with log copied from{' '}
          <button
            className="btn btn-sm btn-primary btn-outline"
            onClick={() => navigateTo(Screen.LOG)}
          >
            Debug log
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
