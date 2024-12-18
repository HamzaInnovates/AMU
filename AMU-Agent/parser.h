#pragma once

#include "utils.h"

struct Log {
	std::string timestamp;
	std::string family_type;
	std::string family;
	std::string file_type;
	std::string file;
	
	Log(
		std::string timestamp = "",
		std::string family_type = "",
		std::string family = "",
		std::string file_type = "",
		std::string file = ""
	) : timestamp(timestamp),
		family_type(family_type),
		family(family),
		file_type(file_type),
		file(file) {}

	void print() const {
		std::cout << "Timestamp: " << timestamp << std::endl;
		std::cout << "Family Type: " << family_type << std::endl;
		std::cout << "Family: " << family << std::endl;
		std::cout << "File Type: " << file_type << std::endl;
		std::cout << "File: " << file << std::endl;
		std::cout << "***************" << std::endl;
	}

	std::map<std::string, std::string> map() const {
		return {
			{"Timestamp", timestamp},
			{"Family Type", family_type},
			{"Family", family},
			{"File Type", file_type},
			{"File", file}
		};
	}
};

struct Version {
	std::string ProductVersion;
	std::string EngineVersion;
	std::string ServiceVersion;
	std::string AVSignatureVersion;
	std::string ASSignatureVersion;

	Version(
		std::string ProductVersion = "",
		std::string EngineVersion = "",
		std::string ServiceVersion = "",
		std::string AVSignatureVersion = "",
		std::string ASSignatureVersion = ""
	) : ProductVersion(ProductVersion),
		EngineVersion(EngineVersion),
		ServiceVersion(ServiceVersion),
		AVSignatureVersion(AVSignatureVersion),
		ASSignatureVersion(ASSignatureVersion) {}

	void print() {
		std::cout << "ProductVersion: " << ProductVersion << std::endl;
		std::cout << "EngineVersion: " << EngineVersion << std::endl;
		std::cout << "ServiceVersion: " << ServiceVersion << std::endl;
		std::cout << "AVSignatureVersion: " << AVSignatureVersion << std::endl;
		std::cout << "ASSignatureVersion: " << ASSignatureVersion << std::endl;
	}

	std::map<std::string, std::string> map() {
		return {
			{"ProductVersion", ProductVersion},
			{"EngineVersion", EngineVersion},
			{"ServiceVersion", ServiceVersion},
			{"AVSignatureVersion", AVSignatureVersion},
			{"ASSignatureVersion", ASSignatureVersion}
		};
	}
};

typedef std::vector<Log> Logs;
typedef std::vector<std::string> List;

struct LogInformation {
	Logs logs;
	Version version;
};

time_t lastLog = NULL;
std::string lastLogStr = "";

LogInformation parseLogs(std::string fileName) {
	 List logs = getFileContents(fileName);
	 Logs ret;
	 Version ver;

	 time_t current_time = NULL;
	 for (const auto& log : logs) {
		auto current = std::split(log, ' ');
		auto timestamp = std::strip(current[0]);
		current_time = std::str_to_time(timestamp);
		if (current_time < lastLog) {
			continue;
		}
		lastLog = current_time;
		lastLogStr = timestamp;

		if (current[1] == "Version:") {
			 current.erase(current.begin() + 1);
			 ver.ProductVersion = std::strip(current[2]);
			 ver.ServiceVersion = std::strip(current[4]);
			 ver.EngineVersion = std::strip(current[6]);
			 ver.ASSignatureVersion = std::strip(current[8]);
			 ver.AVSignatureVersion = std::strip(current[10]);
		}
		else if(current[1] == "DETECTION") {
			 current.erase(current.begin() + 1);
			 auto type = std::split(std::strip(current[1]), ':');
			 auto file = std::split(std::strip(current[2]), ':');
			 ret.push_back(
				 Log(
					 timestamp,
					 std::strip(type[1]),
					 std::strip(type[0]),
					 std::strip(file[0]),
					 std::strip(std::join(file, ':', 1))
				)
			 );
		}
	 }
	 return { ret, ver };
}
