import type { Meta, StoryObj } from '@storybook/react-vite'
import Markdown from './Markdown'

const meta: Meta<typeof Markdown> = {
  title: 'UI/Markdown',
  component: Markdown,
  argTypes: {
    mermaid: { control: 'boolean' },
    httpsImagesOnly: { control: 'boolean' },
  },
}
export default meta

const REPORT = [
  '## Tests',
  '',
  '| Suite | Passed | Failed |',
  '| --- | --- | --- |',
  '| unit | 120 | 3 |',
  '| integration | 42 | 0 |',
  '',
  '- [x] Build',
  '- [ ] Deploy',
  '',
  '<details><summary>3 failures</summary>',
  '',
  '```python',
  'assert residual < 1e-6',
  '```',
  '',
  '</details>',
].join('\n')

const DIAGRAM = ['```mermaid', 'graph LR', '  build --> test --> deploy', '```'].join('\n')

const IMAGES = [
  '![Residuals over https](https://example.com/residuals.png)',
  '![Residuals over http](http://example.com/residuals.png)',
  '![Residuals by relative path](residuals.png)',
].join('\n\n')

export const Report: StoryObj<typeof Markdown> = {
  args: { children: REPORT },
}

export const MermaidDiagram: StoryObj<typeof Markdown> = {
  args: { children: DIAGRAM, mermaid: true },
}

export const HttpsImagesOnly: StoryObj<typeof Markdown> = {
  args: { children: IMAGES, httpsImagesOnly: true },
}
