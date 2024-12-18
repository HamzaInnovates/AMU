#define _SILENCE_CXX17_CODECVT_HEADER_DEPRECATION_WARNINGS
#define _SILENCE_ALL_CXX17_DEPRECATION_WARNINGS

#include "requests.h"
#include "parser.h"
#include "json.hpp"
#include "logger.h"

#include <Windows.h>

std::string API_SERVER;
std::string LOG_PATH;
long SLEEP_TIME;

using json = nlohmann::json;

class RequestHandler {
public:
	json GET(std::string endpoint) {
		try {
			http::Request request{ API_SERVER + endpoint };
			const auto response = request.send("GET");
			return json::parse(std::string{ response.body.begin(), response.body.end() });
		}
		catch (const std::exception& e) {
			std::cerr << "Request failed, error: " << e.what() << '\n';
		}
	}

	json GET(std::string endpoint, json data) {
		try {
			std::string body = data.dump();
			DEBUG("Making Request to %s", std::string(API_SERVER + endpoint).c_str());
			http::Request request{ API_SERVER + endpoint };
			const auto response = request.send("GET", body, {{"Content-Type", "application/json"}});
			return json::parse(std::string{ response.body.begin(), response.body.end() });
		}
		catch (const std::exception& e) {
			FATAL(
				"An error occurred: %s",
				e.what()
			);
		}
	}

	json POST(std::string endpoint, json data) {
		try {
			std::string body = data.dump();
			DEBUG("Making Request to %s", std::string(API_SERVER + endpoint).c_str());
			http::Request request{ API_SERVER + endpoint };
			const auto response = request.send("POST", body, {{"Content-Type", "application/json"}});
			return json::parse(std::string{ response.body.begin(), response.body.end() });
		}
		catch (const std::exception& e) {
			FATAL(
				"An error occurred: %s",
				e.what()
			);
		}
	}
public:
	RequestHandler() {}
	std::string add() {
		json data;
		data["hwid"] = Recon::getHWID();
		data["user_name"] = Recon::getUserName();
		data["machine_name"] = Recon::getMachineName();
		auto resp = POST("/api/clients/add", data);
		return resp.dump();
	}
	std::string send_data(LogInformation lo) {
		json data;
		std::vector<std::map<std::string, std::string>> logs;
		for (const auto& log : lo.logs) {
			logs.push_back(log.map());
		}
		data["logs"] = logs;
		data["hwid"] = Recon::getHWID();
		data["version"] = lo.version.map();
		data["last_log_timestamp"] = lastLogStr;
		auto resp = POST("/api/clients/insert", data);
		return resp.dump();
	}
};

void help(std::string file) {
	printf("%s v0.0.1\n\nUsage:\n\t -c | --config <CONFIG_JSON_FILE> [Default: config.json]\n", file.c_str());
}

int main(int argc, char* argv[]) {

	std::string config = "config.json";
	if (argc == 2 || argc == 3) {
		std::string v1 = argv[1];
		std::string f;
		if (argc == 3) f = argv[2];

		if (v1 == "-h" || v1 == "--help") {
			help(argv[0]);
			return 0;
		}
		else if (v1 == "-c" || v1 == "--config") {
			config = f;
		}
	}

	if (!std::isValidFile(config)) {
		FATAL("%s is not a valid config file. Please check.", config.c_str());
		return 1;
	}

	std::ifstream f(config);
	json data = json::parse(f);

	API_SERVER = data["config"]["API_SERVER"];
	LOG_PATH = data["config"]["LOG_PATH"];
	SLEEP_TIME = data["config"]["SLEEP_TIME"];

	LOG("Initializing AMU agent");
	LOG("API Server: %s", API_SERVER.c_str());


	json hwid;
	hwid["hwid"] = Recon::getHWID();

	RequestHandler rh;
	auto resp = rh.add();
	LOG("Response from server: %s", resp.c_str());
	
	while (true) {
		for (const auto& file : std::getFileInFolder(LOG_PATH)) {
			LOG("Sending logs of %s", file.c_str());
			auto info = parseLogs(LOG_PATH + std::string("/") + file);
			resp = rh.send_data(info);
			LOG("Response from server: %s", resp.c_str());
		}
		// Check if there is a new patch available:
		
		auto resp = rh.GET("/api/clients/check", hwid);
		if (!resp["status"]) {
			ERROR("GOT Resposne: %s", resp["message"].get<std::string>().c_str());
		}
		if (Utils::storeToFile(resp)) {
			MessageBoxA(NULL, "New patch available, please install it.", "AMU Agent", MB_OK | MB_ICONINFORMATION);
		}

		LOG("Sleeping for %d minutes", SLEEP_TIME);
		Sleep(SLEEP_TIME * 60000);
	}

	return 0;

}