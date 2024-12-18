#pragma once
#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <locale>
#include <codecvt>
#include <iomanip>
#include <filesystem>
#include "logger.h"
#include "base64.h"
#include "json.hpp"

namespace fs = std::filesystem;
using json = nlohmann::json;

namespace std {

	std::vector<std::string> split(std::string str, char delim = '\n') {
		std::stringstream ss(str);
		std::vector<std::string> ret;
		std::string temp;

		if (str.size() != std::string::npos) {
			while (std::getline(ss, temp, delim))
				ret.push_back(temp);
		}
		return ret;
	}

	std::string join(std::vector<std::string> vec, char delim = ' ', size_t begin = 0, size_t end = -1) {
		// Changing the default end to be the lenght of the vector
		if (end == -1) end = vec.size();
		std::string ret;
		for (size_t i = begin; i < end; i++) {
			ret += vec[i];
			if (i < end - 1) ret += delim;
		}
		return ret;
	}

	std::string strip(std::string str) {
		auto vec = split(str, ' ');
		// Removing the spaces from the vector:
		vec.erase(std::remove(vec.begin(), vec.end(), ""), vec.end());
		str = join(vec);
		return str;
	}

	inline bool isValidFile(const std::string& fileName) {
		// Check if the file exists or not
		std::ifstream f(fileName.c_str());
		bool ret = f.good();
		f.close(); // Closing the file handler.
		return ret;
	}

	std::vector<std::string> getFileContents(std::string fileName) {

		if (!isValidFile(fileName)) {
			std::string msg = "File does not exist: " + fileName;
			std::cerr << msg << std::endl;
			throw std::runtime_error(msg);
		}

		std::fstream file;
		file.open(fileName, std::ios::in);

		// UTF-16 fix for this:
		file.imbue(std::locale(file.getloc(), new std::codecvt_utf16<char, 0x10FFFF, std::consume_header>));

		std::vector<std::string> ret;
		std::string temp;
		while (std::getline(file, temp)) {
			ret.push_back(temp);
		}
		file.close();
		return ret;
	}

	std::time_t str_to_time(std::string s) {
		std::tm t{};
		std::istringstream ss(s);

		ss >> std::get_time(&t, "%Y-%m-%dT%H:%M:%S");
		if (ss.fail()) {
			throw std::runtime_error{ "failed to parse time string" };
		}
		std::time_t time_stamp = mktime(&t);
	}

	std::vector<std::string> getFileInFolder(std::string path) {
		std::vector<std::string> ret;
		for (const auto& entry : fs::directory_iterator(path)) {
			auto _ = std::split(entry.path().string(), '\\');
			auto name = _[_.size() - 1];
			if (name.find("MPDetection") != std::string::npos) {
				ret.push_back(name);
			}
		}
		return ret;
	}

}

namespace Recon {

	std::string getHWID() {
		std::string uuid;
		HW_PROFILE_INFO hwProfileInfo;
		if (!GetCurrentHwProfile(&hwProfileInfo)) {
			return "[ERROR]";
		}
		std::wstring guid(hwProfileInfo.szHwProfileGuid);
		uuid = std::string(guid.begin(), guid.end()).substr(1, guid.size());
		uuid.pop_back();
		return uuid;
	}


	std::string getUserName() {
		char username[256];
		DWORD len = 256;
		GetUserNameA(username, &len);
		return username;
	}

	std::string getMachineName() {
		char computerName[256];
		DWORD len = 256;
		GetComputerNameA(computerName, &len);
		return computerName;
	}
}

namespace Utils {
	bool storeToFile(json obj) {
		// Check if obj["filename"] exists
		if (obj.find("filename") == obj.end()) {
			std::cerr << "No filename provided" << std::endl;
			return false;
		}

		std::string filename = obj["filename"];
		if (std::isValidFile(filename)) {
			INFO("File already exists.");
			return false;
		}

		std::ofstream file(filename, std::ios::binary);
		// get obj["patch"] as the file:
		std::string patch = obj["patch"];
		
		patch = Base64::Decode(patch);
		file << patch;
		LOG("File stored to: %s", filename.c_str());
		file.close();

	}
}