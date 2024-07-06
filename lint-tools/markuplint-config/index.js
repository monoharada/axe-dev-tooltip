export default {
	nodeRules: [
		{
			selector: "script[src^='https://']",
			rules: {
				'required-attr': "外部スクリプトは使用しません。",
			},
		},
	],
};
