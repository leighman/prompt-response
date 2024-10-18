import { Console, Effect } from 'effect'
import { Command, Prompt } from '@effect/cli'
import { NodeContext, NodeRuntime } from '@effect/platform-node'

const openCommand: Command.Command<'open-the-pod-bay-doors', never, never, {}> =
  Command.make('open-the-pod-bay-doors', {}, () => Console.error('No problem'))

const securityGridCommand = Command.prompt(
  'access-security-grid',
  Prompt.text({
    message: "Ah ah ah, you didn't say the magic word!",
    validate: (s) =>
      s === 'please'
        ? Effect.succeed('please')
        : Effect.fail("YOU DIDN'T SAY THE MAGIC WORD!"),
  }),
  () => Console.error('Why?')
)

const pleaseCommand: Command.Command<
  'please',
  never,
  never,
  {}
> = Command.make('please', {}, () =>
  Console.error('No hope')
)

const job = Command.make('job', {}, () => Effect.void).pipe(
  Command.withSubcommands([openCommand, securityGridCommand, pleaseCommand])
)

const cli = Command.run(job, {
  name: 'Job runner',
  version: 'v1.0.0',
})

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
)
