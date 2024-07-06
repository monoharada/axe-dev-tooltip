import { exec } from "node:child_process";

function runCommand(command: string, commandName: string): Promise<void> {
	console.log(`実行中のコマンド: ${commandName}`);
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`エラー (${commandName}): ${stdout} ${error}`);
				reject({ error, stdout, stderr });
				return;
			}
			if (stderr) {
				console.error(`標準エラー (${commandName}): ${stderr}`);
				reject({ error: new Error(stderr), stdout, stderr });
				resolve();
				return;
			}
			console.log(`標準出力 (${commandName}): ${stdout}`);
			resolve();
		});
	});
}

async function main() {
	const results = await Promise.allSettled([
		runCommand(
			"bunx ls-lint -config ./lint-tools/.ls-lint.yml",
			"ls-lint",
		),
		runCommand(
			"bunx biome check --config-path ./lint-tools/ --write .",
			"biome",
		),
		runCommand(
			"bunx stylelint  '**/*.css' --config lint-tools/.stylelintrc.json --fix --allow-empty-input",
			"stylelint-fix",
		),
		runCommand(
			"bunx stylelint  '**/*.css' --config lint-tools/.stylelintrc.json --allow-empty-input",
			"stylelint",
		),
		runCommand("bunx tsc --noEmit -p tsconfig.json", "tsc"),
		runCommand(
			"bunx markuplint --config lint-tools/.markuplintrc.yml src/**/*.{tsx,html}",
			"markuplint",
		),
		runCommand(
			"bunx cspell --quiet -c ./lint-tools/cspell.jsonc src/**/*",
			"cspell",
		),
		// runCommand(
		// 	"bunx markdownlint-cli2 --config \"./.markdownlint-cli2.jsonc\" \"./**/*.{md,mdx}\" --fix",
		// 	"markdownlint",
		// ),
	]);

	const errors = results.filter((result) => result.status === "rejected");

	if (errors.length > 0) {
		console.error("エラーが発生しました:");
		for (const [index, error] of errors.entries()) {
			if ("reason" in error) {
				// console.log({...error.reason})
				const commandName = error.reason.error.cmd.split(' ')[1] || "不明なコマンド"; // コマンド名を取得
				const fileName = error.reason.stderr.split('\n')[0] || error.reason.stdout.split('\n')[0] || error.reason.stderr.replace(/\n/g, '') || "不明なファイル"; // ファイル名を取得
				console.error(`エラー ${index + 1}: 種別: ${commandName}, ファイル名: ${fileName}`);
			}
		}
		process.exit(1); // エラーがある場合、非ゼロの終了コードを返します
	} else {
		console.log("ok 👍");
	}
}

main();
