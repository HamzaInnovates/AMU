#pragma once
#define LOG(msg, ...) { \
	printf("[\033[0;32mLOG\033[0m] "); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
}

#define WARN(msg, ...) { \
	printf("[\033[0;33mWARN\033[0m] "); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
}

#define ERR(msg, ...) { \
	printf("[\033[0;31mERR\033[0m] "); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
}

#define INFO(msg, ...) { \
	printf("[\033[0;34mINFO\033[0m] "); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
}

#define DEBUG(msg, ...) { \
	printf("[\033[0;35mDEBUG\033[0m] "); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
}

#define FUNCTION(msg, ...) { \
	printf("[\033[0;36mFUNCTION\033[0m] "); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
}

#define PRINT(mode, msg, ...) { \
	printf("[\033[0;34m%s\033[0m] ", mode); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
}

#define FATAL(msg, ...) { \
	printf("[\033[0;31mFATAL\033[0m] "); \
	printf(msg, ##__VA_ARGS__); \
	printf("\n"); \
	exit(-1); \
}