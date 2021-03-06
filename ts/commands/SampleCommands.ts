import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import SampleService from '../services/SampleService';

const configService = new ConfigService();
const sampleService = new SampleService();

class SampleCommands {

  public static addCommands() {

    (caporal as any)
      .command('metric results', 'Sample data when you have the Element and Metric IDs')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['table', 'csv', 'json'], 'table')
      .argument('<elementId>', 'Element ID')
      .argument('<metricId>', 'Metric ID')
      .argument('<metricFqn>', 'Metric FQN')
      .option('--duration <duration>', 'Duration (for example: PT1H, PT1D, PT1W)')
      .option('--startTime <startTime>', 'ISO8601 start time')
      .option('--endTime <endTime>', 'ISO8601 end time')
      .option('--rollup <rollup>', 'Data rollup', ['ZERO', 'PT5M', 'PT1H'], 'PT5M')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        sampleService.getSamples(args.elementId, args.metricId, args.metricFqn, config, logger);
      });

    (caporal as any)
      .command('metric summarize', 'Search for and summarize samples (min, max, avg, sum)')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['table', 'csv', 'json'], 'table')
      .option('--name <name>', 'Element name contains')
      .option('--type <type>', 'Element type')
      .option('--attribute <attribute>', 'Element attribute KEY=VALUE')
      .option('--tag <tag>', 'Element tag KEY=VALUE')
      .option('--collector <collector>', 'Datasource collector')
      .option('--metricFqn <metricFqn>', 'Metric fully qualified name')
      .option('--duration <duration>', 'Duration (for example: PT1H, PT1D, PT1W)')
      .option('--startTime <startTime>', 'ISO8601 start time')
      .option('--endTime <endTime>', 'ISO8601 end time')
      .option('--rollup <rollup>', 'Data rollup', ['ZERO', 'PT5M', 'PT1H'], 'PT5M')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        sampleService.summarizeSamples(config, logger);
      });

  }
}

export default SampleCommands;
