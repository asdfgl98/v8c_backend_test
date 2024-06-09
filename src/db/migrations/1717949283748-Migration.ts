import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717949283748 implements MigrationInterface {
    name = 'Migration1717949283748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`TB_POST\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`views\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`userId\` varchar(255) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD PRIMARY KEY (\`userId\`)`);
        await queryRunner.query(`DROP TABLE \`TB_POST\``);
    }

}
